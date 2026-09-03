package org.pharma.pharma_backend;

public class TransitionRequest {
    public String packId;
    public String eventType;
    public String hash;
    public String fromId;
    public String toId;
    public String sellingDate;
    public String sellingTime;
    public String sellerId;

    // Rich provenance & GPS seller metadata
    public String shopName;
    public String licenseNumber;
    public String location;
    public String latitude;
    public String longitude;
    public String timestamp;
}

