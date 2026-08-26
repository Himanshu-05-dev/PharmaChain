# 🏭 PharmaChain Manufacturer Dashboard — Backend Developer Integration Guide

This document is the **official backend integration specification** for the Manufacturer Web Portal. It contains all API endpoints, request/response schemas, blockchain transition contracts, cryptographic standards, and authentication requirements needed to connect the backend service.

---

## 📌 1. Architecture Overview & Base URL

The frontend is a **React 18 + Vite** application built with a **4-Layer Feature Architecture** (`Components ➔ Custom Hooks ➔ Service Layer ➔ Redux Slices`).

- **Frontend Repository Path**: `d:\Hackathon\MediaCare\Manufacture-DashBoard`
- **Default Frontend Port**: `http://localhost:5173`
- **Backend Base URL**: Configured via `.env` variable `VITE_API_URL` (Defaults to `/api/manufacturer` or `http://localhost:8080/api/manufacturer`)
- **Blockchain Network**: Hyperledger Fabric `v2.5` (Channel: `mychannel`, Chaincode: `pharmacc:v2.5`)

```
┌──────────────────────────────────────┐
│   Manufacturer Dashboard Frontend    │
│      (http://localhost:5173)         │
└──────────────────┬───────────────────┘
                   │ HTTP / JSON API (Bearer JWT or Session)
                   ▼
┌──────────────────────────────────────┐
│   Pharma Backend Service (Gateway)   │
│   (Spring Boot :8080 / Node :4000)   │
└────────┬─────────────────────┬───────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌─────────────────────────────────────────┐
│ MongoDB Database │  │ Hyperledger Fabric Peer Nodes (CouchDB) │
│ (Off-chain Data) │  │  State Keys: :MFG, :INTAKE, :SALE, :RECALL│
└──────────────────┘  └─────────────────────────────────────────┘
```

> [!NOTE]
> **Graceful Mock Fallback**: The frontend is built with deterministic fallback mock datasets in `src/features/dashboard/service/dashboard.api.ts`. You can implement backend endpoints incrementally — any endpoint you connect will seamlessly override the mock data!

---

## 🔑 2. Global Headers & Authentication

All requests from the dashboard should accept:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <JWT_ACCESS_TOKEN>
X-Manufacturer-Id: MFR_MEDCORE_001
```

### CORS Configuration
Your backend must allow origins from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview server)
- Allowed Methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Allowed Headers: `Content-Type, Authorization, X-Manufacturer-Id, X-Service-Token`
- `Access-Control-Allow-Credentials: true`

---

## 📡 3. Complete API Endpoint Specifications

### 3.1 Overview & Dashboard Summary
#### `GET /api/manufacturer/dashboard`
Fetches aggregate KPI metrics, recent activity, active recalls, and system health.

* **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalBatches": 1284,
      "totalBatchesTrend": 8.4,
      "mintedPacks": "2.48M",
      "mintedPacksTrend": 12.6,
      "activeProducts": 84,
      "activeProductsTrend": 3.2,
      "verifiedPackages": "2.31M",
      "verificationRate": 98.4,
      "recalledBatches": 3,
      "recalledBatchesTrend": -25.0,
      "pendingActions": 12
    },
    "profile": {
      "id": "MFR_MEDCORE_001",
      "name": "MedCore Pharmaceuticals Ltd.",
      "licenseNumber": "CDSCO-MFG-DL-2024-88491",
      "keyId": "mfr-key-medcore-001"
    }
  }
}
```

---

### 3.2 Batches & Production Management

#### `GET /api/manufacturer/batches`
List all production batches with optional filtering and pagination.

* **Query Parameters**:
  - `status` (optional): `MINTED` | `PACKAGED` | `DISTRIBUTED` | `RECALLED` | `DRAFT`
  - `search` (optional): Batch ID or Medicine name
  - `page` (optional, default: `1`)
  - `limit` (optional, default: `10`)

* **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "BATCH-2026-001",
      "manufacturerId": "MFR_MEDCORE_001",
      "medicineName": "Paracetamol Tablets IP 500mg",
      "genericName": "Paracetamol",
      "composition": "Paracetamol IP 500mg",
      "dosage": "500mg",
      "strength": "500mg per tablet",
      "form": "Tablet",
      "manufacturingDate": "2026-08-22",
      "expiryDate": "2028-08-21",
      "totalQuantity": 100000,
      "packsMinted": 100000,
      "packSize": 10,
      "mintStatus": "MINTED",
      "productionSite": "Baddi Formulation Unit 1 (FAC-HP-01)",
      "createdAt": "2026-08-22T08:30:00Z",
      "qrPackageStatus": "READY",
      "txHash": "0x8f19e4a0218bcf3991823abce019284102948bbcca8129841",
      "blockNumber": 18421
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1284 }
}
```

---

#### `POST /api/manufacturer/batch`
Create a new medicine batch, sign serial tokens with ECDSA P-256 (`ES256`), and commit `:MFG` mint transition to Hyperledger Fabric.

* **Request Body**:
```json
{
  "medicineName": "Amoxicillin & Potassium Clavulanate 625mg",
  "genericName": "Amoxicillin + Clavulanic Acid",
  "composition": "Amoxicillin Trihydrate IP 500mg + Potassium Clavulanate IP 125mg",
  "dosage": "625mg",
  "strength": "625mg per film coated tablet",
  "form": "Tablet",
  "manufacturingDate": "2026-08-22",
  "expiryDate": "2028-08-21",
  "totalQuantity": 50000,
  "packSize": 6,
  "productionSite": "Baddi Formulation Unit 1 (FAC-HP-01)"
}
```

* **Expected Backend Logic**:
  1. Generate Batch ID (e.g. `BATCH-2026-104`).
  2. For serials `00001` to `N`, generate compact signed JWTs:
     ```json
     {"alg":"ES256","typ":"JWT","kid":"mfr-key-medcore-001"}
     {"batchId":"BATCH-2026-104","serial":"00001","expiryDate":"2028-08-21","manufacturerId":"MFR_MEDCORE_001"}
     ```
  3. Derive `packHash = SHA256(rawSignedJWTString)`.
  4. Submit chaincode invoke `pharmacc:CreateBatch` with key `<packHash>:MFG`.
  5. Store off-chain batch record in MongoDB.

* **Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Batch registered and minted to blockchain successfully.",
  "data": {
    "id": "BATCH-2026-104",
    "medicineName": "Amoxicillin & Potassium Clavulanate 625mg",
    "totalQuantity": 50000,
    "packsMinted": 50000,
    "mintStatus": "MINTED",
    "txHash": "0x4e5a6f7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
    "blockNumber": 18429,
    "createdAt": "2026-08-22T14:10:00Z"
  }
}
```

---

### 3.3 Supply-Chain Recall Center (CDSCO Form 28-A)

#### `POST /api/manufacturer/batch/:batchId/recall`
Initiates a global statutory recall. Appends `<batchId>:RECALL` to the blockchain ledger and locks retail pharmacy POS checkout scanning.

* **Request Body**:
```json
{
  "batchId": "BATCH-2026-041",
  "reason": "Blister packaging seal integrity defect identified during QA retention testing.",
  "severity": "CRITICAL"
}
```

* **Expected Backend Action**:
  1. Commit transition key `BATCH-2026-041:RECALL` into Hyperledger Fabric ledger.
  2. Push WebSocket / SSE event to all connected retail pharmacy POS terminals to immediately quarantine the batch.
  3. Mark batch status as `RECALLED` in MongoDB.

* **Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Recall successfully broadcasted across supply chain ledger.",
  "data": {
    "id": "REC-2026-004",
    "batchId": "BATCH-2026-041",
    "status": "ACTIVE",
    "severity": "CRITICAL",
    "quarantineActionsTaken": [
      "Fabric Ledger :RECALL state appended at block #18430",
      "Immediate POS sale lock broadcasted to 1,842 pharmacy terminals",
      "CDSCO Form 28-A statutory notification generated"
    ],
    "date": "2026-08-22T14:15:00Z"
  }
}
```

---

### 3.4 QR Code Hub & Packaging Export

#### `GET /api/manufacturer/batch/:batchId/qr-export?format=ZIP_PNG`
Exports high-density 2D barcodes for packaging lines.

* **Query Parameters**:
  - `format`: `ZIP_PNG` (300 DPI images) | `ZIP_SVG` (Vector) | `CSV_MANIFEST` (Token list)
* **Response (`200 OK`)**:
  - Returns downloadable binary archive (`application/zip`) or CSV string (`text/csv`).

---

### 3.5 Traceability & 7 Consumer Verification States

#### `GET /api/manufacturer/traceability/verify?token=<TOKEN_OR_HASH>`
Queries individual pack history across all supply chain transitions.

* **7 Possible Verification Response States**:
```json
// State 1: Genuine
{ "status": "GENUINE", "badge": "Verified Genuine", "mfgDate": "2026-08-22", "expDate": "2028-08-21" }

// State 2: At Pharmacy
{ "status": "AT_SHOP", "pharmacy": "Apollo Pharmacy Hub", "license": "DL-2021-99820" }

// State 3: Already Sold (Repackaging Counterfeit Risk)
{ "status": "ALREADY_SOLD", "soldAt": "2026-08-22T10:15:00Z", "shop": "MedPlus Chemist" }

// State 4: Recalled Batch
{ "status": "RECALLED", "recallReason": "Packaging integrity failure", "date": "2026-08-21" }

// State 5: Expired Medicine
{ "status": "EXPIRED", "expiredOn": "2026-07-31" }

// State 6: Counterfeit / Invalid Cryptographic Signature
{ "status": "COUNTERFEIT", "error": "ES256 signature verification failed against manufacturer key" }

// State 7: Not Found on Ledger
{ "status": "NOT_FOUND", "error": "No :MFG mint transaction committed on blockchain" }
```

---

### 3.6 Hyperledger Fabric Ledger Explorer

#### `GET /api/manufacturer/ledger/transitions`
Fetches real-time append-only state transitions committed on `mychannel`.

* **Response (`200 OK`)**:
```json
{
  "success": true,
  "blockHeight": 18421,
  "data": [
    {
      "docType": "transition",
      "hash": "a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91:MFG",
      "fromId": "MFR_MEDCORE_001",
      "toId": "FAC-HP-01",
      "sellingDate": "2026-08-22",
      "sellingTime": "08:30:14",
      "sellerId": "SYSTEM_MINT_OPERATOR",
      "blockNumber": 18421
    },
    {
      "docType": "transition",
      "hash": "a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91:INTAKE",
      "fromId": "FAC-HP-01",
      "toId": "PHARM_APOLLO_01",
      "sellingDate": "2026-08-22",
      "sellingTime": "11:45:00",
      "sellerId": "APOLLO_INTAKE_SCANNER",
      "blockNumber": 18422
    },
    {
      "docType": "transition",
      "hash": "a8f4c910129b01e23764839201f8e9102b48925bb90f2c381294d61085f25b91:SALE",
      "fromId": "PHARM_APOLLO_01",
      "toId": "CONSUMER_WALLET",
      "sellingDate": "2026-08-22",
      "sellingTime": "14:20:10",
      "sellerId": "POS_TERMINAL_409",
      "blockNumber": 18423
    }
  ]
}
```

---

### 3.7 B2B Pharmacy Orders & Logistics

#### `GET /api/manufacturer/orders`
Fetch commercial pharmacy orders and fulfillment status.

#### `PATCH /api/manufacturer/order/:orderId/status`
Update dispatch status (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).

* **Request Body**:
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK-BLUEDART-8891240"
}
```

---

### 3.8 Security & Cryptographic Key Vault

#### `GET /.well-known/jwks.json`
Public JWKS key discovery endpoint providing the ECDSA P-256 public key for client-side offline verification.

* **Response (`200 OK`)**:
```json
{
  "keys": [
    {
      "kty": "EC",
      "crv": "P-256",
      "kid": "mfr-key-medcore-001",
      "use": "sig",
      "alg": "ES256",
      "x": "f83OJ3D2xFmT4v_Xasdf_8A...",
      "y": "x_da418Bcf991823abce019..."
    }
  ]
}
```

---

## 🛠️ 4. Environment Variables Checklist

Ensure your backend `.env` provides the corresponding environment variables:

```env
# Server Port & Host
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pharmachain

# JWT & Authentication
JWT_SECRET=your_backend_jwt_secret_here
JWT_REFRESH_SECRET=your_backend_refresh_secret_here

# Hyperledger Fabric Gateway Configuration
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=pharmacc:v2.5
FABRIC_MSP_ID=ManufacturerOrgMSP
FABRIC_PEER_ENDPOINT=localhost:7051

# Cryptographic Keystore
MFR_PRIVATE_KEY_PATH=/vault/keys/mfr_ecdsa_p256_private.pem
MFR_PUBLIC_KEY_PATH=/vault/keys/mfr_ecdsa_p256_public.pem
MFR_KEY_ID=mfr-key-medcore-001
```

---

## 🚀 5. How to Run & Test Frontend Against Your Backend

```bash
# 1. Clone repository & enter dashboard directory
cd Manufacture-DashBoard

# 2. Install dependencies
npm install

# 3. Point frontend to your backend API in .env
# Edit .env file:
VITE_API_URL=http://localhost:8080/api/manufacturer

# 4. Start frontend dev server
npm run dev

# 5. Build production bundle test
npm run build
```

---

## 👥 Point of Contact

If you have questions about request payloads, schemas, or blockchain transition contracts, refer to the architectural specification in `architecture.md` or contact the team.
