package org.pharma.pharma_backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hyperledger.fabric.client.Contract;
import org.hyperledger.fabric.client.Network;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transition")
public class TransitionController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Contract getContract() throws Exception {
        Network network = FabricConfig.getNetwork();
        return network.getContract("pharmacc");
    }

    private static String normalizeEventType(String eventType) {
        if (eventType == null) {
            return null;
        }
        String e = eventType.trim().toUpperCase();
        if ("MFG".equals(e)) {
            return "MINTED";
        }
        if ("SALE".equals(e)) {
            return "SOLD";
        }
        return e;
    }

    private static String[] resolvePackAndEvent(TransitionRequest req) {
        String packId = req.packId;
        String eventType = req.eventType;

        if ((packId == null || packId.isBlank() || eventType == null || eventType.isBlank())
                && req.hash != null && !req.hash.isBlank()) {
            int idx = req.hash.lastIndexOf('~');
            if (idx < 0) {
                idx = req.hash.lastIndexOf(':');
            }
            if (idx > 0 && idx < req.hash.length() - 1) {
                packId = req.hash.substring(0, idx);
                eventType = req.hash.substring(idx + 1);
            }
        }

        return new String[]{packId, normalizeEventType(eventType)};
    }

    @PostMapping
    public String recordTransition(@RequestBody TransitionRequest req) throws Exception {
        String[] resolved = resolvePackAndEvent(req);
        byte[] result = getContract().submitTransaction(
            "recordTransition",
            resolved[0], resolved[1], req.fromId, req.toId, req.sellingDate, req.sellingTime, req.sellerId
        );
        return new String(result);
    }

    @PostMapping("/batch")
    public String recordTransitionsBatch(@RequestBody BatchTransitionRequest req) throws Exception {
        String transitionsJson = objectMapper.writeValueAsString(req.transitions);
        byte[] result = getContract().submitTransaction(
            "recordTransitionBatch",
            req.batchId == null ? "" : req.batchId,
            transitionsJson
        );
        return new String(result);
    }

    // Deprecated recall endpoint removed per architecture specification

    @PostMapping("/recall")
    public String recallBatchFromBody(@RequestBody RecallRequest req) throws Exception {
        byte[] result = getContract().submitTransaction(
            "recallBatch",
            req.systemBatchId, req.actorId, req.reason, req.recallDate, req.recallTime
        );
        return new String(result);
    }

    @GetMapping("/pack/{hash}/current")
    public String getPackCurrentState(@PathVariable String hash) throws Exception {
        byte[] result = getContract().evaluateTransaction("getPackCurrentState", hash);
        return new String(result);
    }

    @GetMapping("/pack/{hash}/history")
    public String getPackHistory(@PathVariable String hash) throws Exception {
        byte[] result = getContract().evaluateTransaction("getPackHistory", hash);
        return new String(result);
    }

    @GetMapping("/status")
    public String getPackStatus(@RequestParam String packHash, @RequestParam String batchId) throws Exception {
        byte[] result = getContract().evaluateTransaction("getPackStatus", packHash, batchId);
        return new String(result);
    }

    @GetMapping("/{hash}")
    public String getByHash(@PathVariable String hash) throws Exception {
        byte[] result = getContract().evaluateTransaction("getTransitionByHash", hash);
        return new String(result);
    }

    @GetMapping
    public String query(@RequestParam(required = false, defaultValue = "") String fromId,
                         @RequestParam(required = false, defaultValue = "") String toId,
                         @RequestParam(required = false, defaultValue = "") String hash) throws Exception {
        byte[] result = getContract().evaluateTransaction("queryTransition", fromId, toId, hash);
        return new String(result);
    }
}
