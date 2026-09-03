/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.assettransfer;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Transition {

    @Property()
    private final String docType = "transition";

    @Property()
    private final String packId;

    @Property()
    private final String batchId;

    @Property()
    private final String eventType;

    @Property()
    private final String status;

    @Property()
    private final String hash;

    @Property()
    private final String fromId;

    @Property()
    private final String toId;

    @Property()
    private final String sellingDate;

    @Property()
    private final String sellingTime;

    @Property()
    private final String sellerId;

    @Property()
    private final String shopName;

    @Property()
    private final String licenseNumber;

    @Property()
    private final String location;

    @Property()
    private final String latitude;

    @Property()
    private final String longitude;

    @Property()
    private final String timestamp;

    public String getDocType() {
        return docType;
    }

    public String getPackId() {
        return packId;
    }

    public String getBatchId() {
        return batchId != null ? batchId : "";
    }

    public String getEventType() {
        return eventType;
    }

    public String getStatus() {
        return status != null ? status : eventType;
    }

    public String getHash() {
        return hash;
    }

    public String getFromId() {
        return fromId;
    }

    public String getToId() {
        return toId;
    }

    public String getSellingDate() {
        return sellingDate;
    }

    public String getSellingTime() {
        return sellingTime;
    }

    public String getSellerId() {
        return sellerId;
    }

    public String getShopName() {
        return shopName != null ? shopName : "";
    }

    public String getLicenseNumber() {
        return licenseNumber != null ? licenseNumber : "";
    }

    public String getLocation() {
        return location != null ? location : "";
    }

    public String getLatitude() {
        return latitude != null ? latitude : "";
    }

    public String getLongitude() {
        return longitude != null ? longitude : "";
    }

    public String getTimestamp() {
        return timestamp != null ? timestamp : "";
    }

    public Transition(
            @JsonProperty("packId") final String packId,
            @JsonProperty("batchId") final String batchId,
            @JsonProperty("eventType") final String eventType,
            @JsonProperty("status") final String status,
            @JsonProperty("hash") final String hash,
            @JsonProperty("fromId") final String fromId,
            @JsonProperty("toId") final String toId,
            @JsonProperty("sellingDate") final String sellingDate,
            @JsonProperty("sellingTime") final String sellingTime,
            @JsonProperty("sellerId") final String sellerId,
            @JsonProperty("shopName") final String shopName,
            @JsonProperty("licenseNumber") final String licenseNumber,
            @JsonProperty("location") final String location,
            @JsonProperty("latitude") final String latitude,
            @JsonProperty("longitude") final String longitude,
            @JsonProperty("timestamp") final String timestamp) {
        this.packId = packId;
        this.batchId = batchId != null ? batchId : "";
        this.eventType = eventType;
        this.status = status != null ? status : eventType;
        this.hash = hash;
        this.fromId = fromId;
        this.toId = toId;
        this.sellingDate = sellingDate;
        this.sellingTime = sellingTime;
        this.sellerId = sellerId;
        this.shopName = shopName != null ? shopName : "";
        this.licenseNumber = licenseNumber != null ? licenseNumber : "";
        this.location = location != null ? location : "";
        this.latitude = latitude != null ? latitude : "";
        this.longitude = longitude != null ? longitude : "";
        this.timestamp = timestamp != null ? timestamp : "";
    }

    // Overload constructor for backwards compatibility with 10 arguments
    public Transition(
            final String packId,
            final String batchId,
            final String eventType,
            final String status,
            final String hash,
            final String fromId,
            final String toId,
            final String sellingDate,
            final String sellingTime,
            final String sellerId) {
        this(packId, batchId, eventType, status, hash, fromId, toId, sellingDate, sellingTime, sellerId, "", "", "", "", "", "");
    }

    // Overload constructor for legacy 8 arguments
    public Transition(
            final String packId,
            final String eventType,
            final String hash,
            final String fromId,
            final String toId,
            final String sellingDate,
            final String sellingTime,
            final String sellerId) {
        this(packId, "", eventType, eventType, hash, fromId, toId, sellingDate, sellingTime, sellerId, "", "", "", "", "", "");
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Transition other = (Transition) obj;

        return Objects.deepEquals(
                new String[] {getPackId(), getBatchId(), getEventType(), getStatus(), getHash(), getFromId(), getToId(), getSellingDate(), getSellingTime(), getSellerId(), getShopName(), getLicenseNumber(), getLocation(), getTimestamp()},
                new String[] {other.getPackId(), other.getBatchId(), other.getEventType(), other.getStatus(), other.getHash(), other.getFromId(), other.getToId(), other.getSellingDate(),
                        other.getSellingTime(), other.getSellerId(), other.getShopName(), other.getLicenseNumber(), other.getLocation(), other.getTimestamp()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPackId(), getBatchId(), getEventType(), getStatus(), getHash(), getFromId(), getToId(), getSellingDate(), getSellingTime(), getSellerId(), getShopName(), getLicenseNumber(), getLocation(), getTimestamp());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode())
                + " [packId=" + packId + ", batchId=" + batchId + ", eventType=" + eventType + ", status=" + status
                + ", hash=" + hash + ", fromId=" + fromId + ", toId=" + toId
                + ", sellingDate=" + sellingDate + ", sellingTime=" + sellingTime + ", sellerId=" + sellerId
                + ", shopName=" + shopName + ", licenseNumber=" + licenseNumber + ", location=" + location
                + ", timestamp=" + timestamp + "]";
    }
}
