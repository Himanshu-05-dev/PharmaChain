/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.assettransfer;

import java.util.ArrayList;
import java.util.List;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;
import org.hyperledger.fabric.shim.ledger.KeyModification;

import com.owlike.genson.Genson;
import org.json.JSONArray;
import org.json.JSONObject;

@Contract(
        name = "pharmacc",
        info = @Info(
                title = "Pharma Transition Ledger",
                description = "Records manufacturer-distributor-shopkeeper-customer transitions for medicine units",
                version = "0.0.1-SNAPSHOT",
                license = @License(
                        name = "Apache 2.0 License",
                        url = "http://www.apache.org/licenses/LICENSE-2.0.html"),
                contact = @Contact(
                        email = "team@example.com",
                        name = "Pharma Hackathon Team",
                        url = "https://example.com")))
@Default
public final class PharmaContract implements ContractInterface {

    private final Genson genson = new Genson();

    private static String normalizeEventType(final String eventType) {
        if (eventType == null) {
            return null;
        }
        String normalized = eventType.trim().toUpperCase();
        if ("MFG".equals(normalized)) {
            return "MINTED";
        }
        if ("SALE".equals(normalized)) {
            return "SOLD";
        }
        return normalized;
    }

    private static String extractBatchId(final String batchState) {
        if (batchState == null || batchState.isEmpty()) {
            return "";
        }
        if (batchState.trim().startsWith("{")) {
            try {
                JSONObject obj = new JSONObject(batchState);
                return obj.optString("batchId", "");
            } catch (Exception e) {
                return batchState;
            }
        }
        return batchState;
    }

    private enum PharmaContractErrors {
        TRANSITION_NOT_FOUND,
        TRANSITION_ALREADY_EXISTS,
        INVALID_GENESIS,
        ALREADY_SOLD,
        BATCH_RECALLED,
        INVALID_TRANSITION,
        CUSTODY_CHAIN_VIOLATION,
        UNAUTHORIZED_SELLER
    }

    /**
     * Records a new transition on the ledger, keyed by event key and updating current state.
     *
     * @param ctx the transaction context
     * @param packId the unique packHash for this unit
     * @param eventType the type of event (MINTED | INTAKE | AT_SHOP | SOLD | RECALLED)
     * @param fromId the ID of the party transferring (e.g. shop ID)
     * @param toId the ID of the party receiving (e.g. customer/buyer ID)
     * @param sellingDate the date of sale, format ddmmyyyy
     * @param sellingTime the time of sale, format hh:mm:ss
     * @param sellerId the ID of the seller recording this transition
     * @return the created Transition
     */
    /**
     * Records a single transition with rich seller details, CDSCO license, GPS location, and timestamp.
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public Transition recordTransitionDetailed(final Context ctx, final String packId, final String eventType, final String fromId,
            final String toId, final String sellingDate, final String sellingTime, final String sellerId,
            final String shopName, final String licenseNumber, final String location, final String latitude,
            final String longitude, final String timestamp) {

        String normalizedEventType = normalizeEventType(eventType);

        String eventKey = packId + ":" + normalizedEventType;
        String currentKey = packId + ":CURRENT";
        // Check if parent batch has been recalled
        String batchState = ctx.getStub().getStringState(packId + ":BATCH");
        String batchId = extractBatchId(batchState);

        if (batchId != null && !batchId.isEmpty()) {
            String recallState = ctx.getStub().getStringState(batchId + ":RECALLED");
            if (recallState == null || recallState.isEmpty()) {
                recallState = ctx.getStub().getStringState(batchId + ":RECALL");
            }
            if (recallState != null && !recallState.isEmpty()) {
                throw new ChaincodeException("Pack belongs to a recalled batch", PharmaContractErrors.BATCH_RECALLED.toString());
            }
        }

        // Custody Chain Validation
        String currentJson = ctx.getStub().getStringState(currentKey);
        if (currentJson == null || currentJson.isEmpty()) {
            if (!"MINTED".equalsIgnoreCase(normalizedEventType)) {
                throw new ChaincodeException("A pack must originate with a MINTED event. Cannot start at " + normalizedEventType,
                        PharmaContractErrors.INVALID_GENESIS.toString());
            }
        } else {
            Transition current = genson.deserialize(currentJson, Transition.class);

            if ("SOLD".equalsIgnoreCase(current.getEventType())) {
                throw new ChaincodeException("Pack has already been SOLD. Double-spending / clone detected.",
                        PharmaContractErrors.ALREADY_SOLD.toString());
            }
            if ("RECALLED".equalsIgnoreCase(current.getEventType())) {
                throw new ChaincodeException("Pack belongs to a RECALLED batch.", PharmaContractErrors.BATCH_RECALLED.toString());
            }

            if ("INTAKE".equalsIgnoreCase(normalizedEventType) || "AT_SHOP".equalsIgnoreCase(normalizedEventType)) {
                if (!"MINTED".equalsIgnoreCase(current.getEventType()) && !"IN_TRANSIT".equalsIgnoreCase(current.getEventType())) {
                    throw new ChaincodeException("Cannot INTAKE pack from state " + current.getEventType(),
                            PharmaContractErrors.INVALID_TRANSITION.toString());
                }
            } else if ("SOLD".equalsIgnoreCase(normalizedEventType)) {
                if (!"AT_SHOP".equalsIgnoreCase(current.getEventType()) && !"INTAKE".equalsIgnoreCase(current.getEventType())) {
                    throw new ChaincodeException("Front-running violation: Cannot sell pack before official INTAKE by shop.",
                            PharmaContractErrors.CUSTODY_CHAIN_VIOLATION.toString());
                }
                if (!current.getToId().equalsIgnoreCase(fromId)) {
                    throw new ChaincodeException("Shop " + fromId + " does not own pack. Registered owner: " + current.getToId(),
                            PharmaContractErrors.UNAUTHORIZED_SELLER.toString());
                }
            }
        }

        Transition transition = new Transition(
                packId,
                batchId != null ? batchId : "",
                normalizedEventType,
                normalizedEventType,
                eventKey,
                fromId,
                toId,
                sellingDate,
                sellingTime,
                sellerId,
                shopName != null ? shopName : "",
                licenseNumber != null ? licenseNumber : "",
                location != null ? location : "",
                latitude != null ? latitude : "",
                longitude != null ? longitude : "",
                timestamp != null ? timestamp : ""
        );
        String sortedJson = genson.serialize(transition);
        ctx.getStub().putStringState(eventKey, sortedJson);
        ctx.getStub().putStringState(currentKey, sortedJson);

        return transition;
    }

    /**
     * Records a single transition (backwards compatible).
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public Transition recordTransition(final Context ctx, final String packId, final String eventType, final String fromId,
            final String toId, final String sellingDate, final String sellingTime, final String sellerId) {
        return recordTransitionDetailed(ctx, packId, eventType, fromId, toId, sellingDate, sellingTime, sellerId, "", "", "", "", "", "");
    }

    /**
     * Records multiple transitions in bulk with soft idempotency and batch mappings.
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public String recordTransitionsBatch(final Context ctx, final String batchId, final String transitionsJson) {
        JSONArray jsonArray = new JSONArray(transitionsJson);
        List<String> recorded = new ArrayList<>();
        List<String> failures = new ArrayList<>();
        int total = jsonArray.length();

        for (int i = 0; i < total; i++) {
            JSONObject item = jsonArray.getJSONObject(i);
            String packId = item.optString("packId", "");
            String eventType = normalizeEventType(item.optString("eventType", "MINTED"));
            try {
                String eventKey = packId + ":" + eventType;
                String currentKey = packId + ":CURRENT";
                String batchKey = packId + ":BATCH";

                // Save mapping to batch as valid JSON document for CouchDB
                JSONObject batchDoc = new JSONObject();
                batchDoc.put("docType", "batch_mapping");
                batchDoc.put("packId", packId);
                batchDoc.put("batchId", batchId == null ? "" : batchId);
                batchDoc.put("status", eventType);
                ctx.getStub().putStringState(batchKey, batchDoc.toString());

                // Check idempotency
                String existing = ctx.getStub().getStringState(eventKey);
                if (existing != null && !existing.isEmpty()) {
                    recorded.add(packId);
                    continue;
                }

                Transition t = new Transition(
                    packId,
                    batchId == null ? "" : batchId,
                    eventType,
                    eventType, // status
                    eventKey,
                    item.optString("fromId", "GENESIS"),
                    item.optString("toId", ""),
                    item.optString("sellingDate", ""),
                    item.optString("sellingTime", ""),
                    item.optString("sellerId", ""),
                    item.optString("shopName", ""),
                    item.optString("licenseNumber", ""),
                    item.optString("location", ""),
                    item.optString("latitude", ""),
                    item.optString("longitude", ""),
                    item.optString("timestamp", "")
                );
                String tJson = genson.serialize(t);
                ctx.getStub().putStringState(eventKey, tJson);
                ctx.getStub().putStringState(currentKey, tJson);
                recorded.add(packId);
            } catch (Exception e) {
                failures.add(packId + ": " + e.getMessage());
            }
        }

        StringBuilder result = new StringBuilder();
        result.append("{\"status\":\"").append(failures.isEmpty() ? "success" : "partial").append("\",")
              .append("\"totalProcessed\":").append(total).append(",")
              .append("\"committedCount\":").append(recorded.size()).append(",")
              .append("\"failedCount\":").append(failures.size()).append(",")
              .append("\"recordedHashes\":").append(new JSONArray(recorded).toString()).append("}");
        return result.toString();
    }

    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public String recordTransitionBatch(final Context ctx, final String batchId, final String transitionsJson) {
        return recordTransitionsBatch(ctx, batchId, transitionsJson);
    }

    /**
     * Issues a recall on an entire batch.
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public String recallBatch(final Context ctx, final String systemBatchId, final String actorId,
            final String reason, final String recallDate, final String recallTime) {
        String key1 = systemBatchId + ":RECALLED";
        String key2 = systemBatchId + ":RECALL";

        Transition recallTransition = new Transition(
                systemBatchId,
                systemBatchId,
                "RECALLED",
                "RECALLED",
                key1,
                actorId,
                "RECALLED",
                recallDate,
                recallTime,
                reason
        );
        String json = genson.serialize(recallTransition);

        ctx.getStub().putStringState(key1, json);
        ctx.getStub().putStringState(key2, json);

        return json;
    }

    /**
     * Evaluates live status for a pack.
     */
    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String getPackStatus(final Context ctx, final String packHash, final String batchId) {
        // Priority 1: Batch Recall
        String recallState = ctx.getStub().getStringState(batchId + ":RECALLED");
        if (recallState == null || recallState.isEmpty()) {
            recallState = ctx.getStub().getStringState(batchId + ":RECALL");
        }
        if (recallState != null && !recallState.isEmpty()) {
            return "{\"status\":\"Recalled\",\"detail\":" + recallState + "}";
        }

        // Priority 2: Pack Current State
        String currentKey = packHash + ":CURRENT";
        String currentJson = ctx.getStub().getStringState(currentKey);
        if (currentJson != null && !currentJson.isEmpty()) {
            Transition t = genson.deserialize(currentJson, Transition.class);
            String status = "UNKNOWN";
            if ("INTAKE".equalsIgnoreCase(t.getEventType()) || "AT_SHOP".equalsIgnoreCase(t.getEventType())) {
                status = "AtShop";
            } else if ("SOLD".equalsIgnoreCase(t.getEventType()) || "SALE".equalsIgnoreCase(t.getEventType())) {
                status = "Sold";
            } else if ("RECALLED".equalsIgnoreCase(t.getEventType())) {
                status = "Recalled";
            } else if ("MINTED".equalsIgnoreCase(t.getEventType())) {
                status = "Minted";
            }
            return "{\"status\":\"" + status + "\",\"detail\":" + currentJson + "}";
        }

        return "{\"status\":\"NOT_FOUND\"}";
    }

    /**
     * Retrieves the current state pointer for a pack.
     */
    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public Transition getPackCurrentState(final Context ctx, final String packHash) {
        String currentKey = packHash + ":CURRENT";
        String json = ctx.getStub().getStringState(currentKey);
        if (json == null || json.isEmpty()) {
            throw new ChaincodeException(String.format("Transition current state for %s does not exist", packHash),
                    PharmaContractErrors.TRANSITION_NOT_FOUND.toString());
        }
        return genson.deserialize(json, Transition.class);
    }

    /**
     * Retrieves chronological lifecycle history for a pack.
     */
    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String getPackHistory(final Context ctx, final String packHash) {
        String currentKey = packHash + ":CURRENT";
        QueryResultsIterator<KeyModification> results = ctx.getStub().getHistoryForKey(currentKey);
        List<Transition> history = new ArrayList<>();
        for (KeyModification result : results) {
            if (!result.isDeleted()) {
                Transition transition = genson.deserialize(result.getStringValue(), Transition.class);
                history.add(transition);
            }
        }
        return genson.serialize(history);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public Transition getTransitionByHash(final Context ctx, final String hash) {
        String transitionJSON = ctx.getStub().getStringState(hash);

        if (transitionJSON == null || transitionJSON.isEmpty()) {
            String errorMessage = String.format("Transition with hash %s does not exist", hash);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, PharmaContractErrors.TRANSITION_NOT_FOUND.toString());
        }

        return genson.deserialize(transitionJSON, Transition.class);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public boolean TransitionExists(final Context ctx, final String hash) {
        String transitionJSON = ctx.getStub().getStringState(hash);

        return (transitionJSON != null && !transitionJSON.isEmpty());
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String queryTransition(final Context ctx, final String fromId, final String toId, final String hash) {
        ChaincodeStub stub = ctx.getStub();

        StringBuilder selector = new StringBuilder("{\"selector\":{\"docType\":\"transition\"");
        if (fromId != null && !fromId.isEmpty()) {
            selector.append(",\"fromId\":\"").append(fromId).append("\"");
        }
        if (toId != null && !toId.isEmpty()) {
            selector.append(",\"toId\":\"").append(toId).append("\"");
        }
        if (hash != null && !hash.isEmpty()) {
            selector.append(",\"hash\":\"").append(hash).append("\"");
        }
        selector.append("}}");

        List<Transition> queryResults = new ArrayList<>();
        QueryResultsIterator<KeyValue> results = stub.getQueryResult(selector.toString());

        for (KeyValue result : results) {
            Transition transition = genson.deserialize(result.getStringValue(), Transition.class);
            queryResults.add(transition);
        }

        return genson.serialize(queryResults);
    }
}
