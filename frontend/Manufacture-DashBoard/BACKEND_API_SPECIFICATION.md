# PharmaChain — Manufacturer Backend Service API Specification
**Version**: 1.0.0-PROD  
**Target Backend Service**: `services/manufacturer` & `services/pharma-core`  
**Base Path**: `/api/manufacturer`  
**Frontend Repository**: `Manufacture-DashBoard`  

---

## 1. Overview & Architecture

The Manufacturer Dashboard connects directly to the Kubernetes-deployed microservices stack:

```
+-----------------------------------------------------------------------------------+
|                           Frontend (Vite / React / Redux)                        |
+-----------------------------------------------------------------------------------+
             |                                                  |
             | /api/manufacturer/*                             | /core/* (Direct Core)
             v                                                  v
+-------------------------------+             +------------------------------------+
|      Manufacturer Service     |             |       Pharma-Core Service          |
|      (Port 4001 / K8s Svc)    |             |       (Port 4000 / K8s Svc)        |
+-------------------------------+             +------------------------------------+
       |                |                                    |
       v                v                                    v
+--------------+ +--------------------+             +------------------------------+
|  MongoDB     | | Redis Token/Cache  |             | Hyperledger Fabric Ledger    |
| (Batches/MFR)| | (Blacklist/Queue)  |             | (ECDSA ES256 P-256 Signatures|
+--------------+ +--------------------+             +------------------------------+
```

### Authentication & Headers
- **User JWT Authorization**:
  - Sent on all protected endpoints: `Authorization: Bearer <jwt_token>`
  - Also supported via HTTP-only cookie: `token=<jwt_token>`
- **Admin CDSCO Authorization**:
  - Sent for regulatory/government operations (e.g. KYC Approval): `X-Admin-Token: <admin_secret>` (Configured via `VITE_ADMIN_TOKEN` or `ADMIN_SECRET_KEY`)
- **Content-Type**: `application/json` (except file export streams).

---

## 2. Authentication Endpoints

### 2.1 Manufacturer Registration
Registers a new pharmaceutical manufacturing entity in `PENDING` KYC state.

- **Endpoint**: `POST /api/manufacturer/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "companyName": "Cipla Pharmaceuticals Ltd.",
  "licenseNumber": "MH-CDSCO-2026-90812",
  "email": "regulatory@cipla.com",
  "password": "StrongPassword123!"
}
```
- **Response `201 Created`**:
```json
{
  "status": "success",
  "message": "Manufacturer registered successfully. Pending CDSCO KYC approval.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "companyName": "Cipla Pharmaceuticals Ltd.",
    "email": "regulatory@cipla.com",
    "licenseNumber": "MH-CDSCO-2026-90812",
    "kycStatus": "PENDING",
    "createdAt": "2026-08-23T14:30:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: `{ "status": "error", "message": "License number already exists" }`
  - `422 Unprocessable Entity`: `{ "status": "error", "message": "Invalid email or password complexity" }`

---

### 2.2 Manufacturer Login
Authenticates an approved manufacturer and issues a JWT token.

- **Endpoint**: `POST /api/manufacturer/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "regulatory@cipla.com",
  "password": "StrongPassword123!"
}
```
- **Response `200 OK` (Approved Account)**:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "MFR_CIPLA_001",
    "email": "regulatory@cipla.com",
    "companyName": "Cipla Pharmaceuticals Ltd.",
    "licenseNumber": "MH-CDSCO-2026-90812",
    "kycStatus": "APPROVED",
    "keyId": "KEY-CIPLA-EC256-01",
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...\n-----END PUBLIC KEY-----"
  }
}
```
- **Response `403 Forbidden` (KYC Pending Approval)**:
```json
{
  "status": "error",
  "code": "KYC_PENDING",
  "message": "Account pending CDSCO KYC approval",
  "manufacturerId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```
- **Error Responses**:
  - `401 Unauthorized`: `{ "status": "error", "message": "Invalid email or password" }`

---

### 2.3 CDSCO KYC Approval (Admin Action)
Provisions hardware-secured ES256 keypair on `pharma-core` and marks the manufacturer account as `APPROVED`.

- **Endpoint**: `POST /api/manufacturer/auth/kyc/approve`
- **Access**: Restricted (Admin Only)
- **Headers**: `X-Admin-Token: <admin_secret>`
- **Request Body**:
```json
{
  "manufacturerId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "email": "regulatory@cipla.com"
}
```
- **Response `200 OK`**:
```json
{
  "status": "success",
  "message": "Manufacturer KYC approved and ECDSA P-256 keys provisioned successfully.",
  "data": {
    "manufacturerId": "MFR_CIPLA_001",
    "kycStatus": "APPROVED",
    "keyId": "KEY-CIPLA-EC256-01",
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...\n-----END PUBLIC KEY-----"
  }
}
```

---

### 2.4 Logout
Invalidates the active session and clears HTTP-only authentication cookies.

- **Endpoint**: `POST /api/manufacturer/auth/logout`
- **Access**: Authenticated (`Bearer <token>`)
- **Response `204 No Content`**

---

## 3. Batch Lifecycle & Minting Endpoints

### 3.1 Register Production Batch
Registers a formulation batch with statutory data, chemical assay results, and packaging parameters.

- **Endpoint**: `POST /api/manufacturer/batch`
- **Access**: Authenticated (`Bearer <token>`)
- **Request Body**:
```json
{
  "medicineName": "Azithromycin 500mg IP",
  "genericName": "Azithromycin",
  "brandName": "Azee 500",
  "dosage": "500mg",
  "strength": "500 mg",
  "form": "Tablet",
  "composition": "Each film-coated tablet contains: Azithromycin Dihydrate IP equivalent to Azithromycin anhydrous 500mg",
  "drugSchedule": "Schedule H",
  "pharmacopoeiaStandard": "IP (Indian Pharmacopoeia)",
  "manufacturingDate": "2026-08-01",
  "expiryDate": "2028-08-01",
  "storageConditions": "Store below 25°C in a dry place. Protect from light.",
  "shelfLifeMonths": 24,
  "productionSite": "Cipla Unit VII, Verna Industrial Estate, Goa",
  "manufacturingLicenseNo": "MH-CDSCO-2026-90812",
  "productionLineId": "LINE-TABLET-04",
  "supervisorId": "SUP-GOA-8812",
  "shiftCode": "SHIFT-A",
  "totalQuantity": 50000,
  "packSize": 10,
  "packType": "Alu-Alu Blister Strip",
  "unitsPerCarton": 500,
  "cdscoApprovalNo": "CDSCO-MFG-AZI-2026-09",
  "gstin": "27AAACC1206D1ZM",
  "hsn": "30042010",
  "controlledSubstance": false,
  "coldChainRequired": false,
  "qaOfficerId": "QA-VERMA-912",
  "coaReferenceNo": "COA-AZI-2026-8819",
  "microbialTestStatus": "PASSED",
  "dissolutionTestStatus": "PASSED",
  "assayResult": "99.8% purity",
  "internalBatchNotes": "Production validated under GMP 2026 guidelines.",
  "tags": ["Antibiotic", "Fast-Track", "FEFO Priority"]
}
```
- **Response `201 Created`**:
```json
{
  "status": "success",
  "message": "Batch registered successfully.",
  "data": {
    "id": "PC-BATCH-2026-CIPLA-001",
    "systemBatchId": "PC-BATCH-2026-CIPLA-001",
    "manufacturerId": "MFR_CIPLA_001",
    "medicineName": "Azithromycin 500mg IP",
    "genericName": "Azithromycin",
    "totalQuantity": 50000,
    "packsMinted": 0,
    "mintStatus": "PENDING",
    "qrPackageStatus": "NOT_STARTED",
    "createdAt": "2026-08-23T15:10:00.000Z"
  }
}
```

---

### 3.2 List Manufacturer Batches
Retrieves all batches registered by the authenticated manufacturer.

- **Endpoint**: `GET /api/manufacturer/batch`
- **Access**: Authenticated (`Bearer <token>`)
- **Query Parameters**:
  - `status`: `PENDING` | `MINTING` | `MINTED` | `DISTRIBUTED` | `RECALLED`
  - `page`: default `1`
  - `limit`: default `50`
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "PC-BATCH-2026-CIPLA-001",
      "systemBatchId": "PC-BATCH-2026-CIPLA-001",
      "manufacturerId": "MFR_CIPLA_001",
      "medicineName": "Azithromycin 500mg IP",
      "genericName": "Azithromycin",
      "dosage": "500mg",
      "form": "Tablet",
      "totalQuantity": 50000,
      "packsMinted": 5000,
      "packSize": 10,
      "manufacturingDate": "2026-08-01",
      "expiryDate": "2028-08-01",
      "productionSite": "Cipla Unit VII, Goa",
      "mintStatus": "MINTED",
      "qrPackageStatus": "READY",
      "txHash": "0x7a8f9c1b3e4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      "blockNumber": 18431,
      "createdAt": "2026-08-23T15:10:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 50
  }
}
```

---

### 3.3 Trigger Batch Minting (Cryptographic Signing & Hierarchy Creation)
Spawns background cryptographic generation of serialized Tier 1 ECDSA-signed tokens and aggregation trees (Packs -> Boxes -> Cartons).

- **Endpoint**: `POST /api/manufacturer/batch/:batchId/mint`
- **Access**: Authenticated (`Bearer <token>`)
- **Path Parameters**: `batchId` (e.g. `PC-BATCH-2026-CIPLA-001`)
- **Response `202 Accepted`**:
```json
{
  "status": "accepted",
  "message": "Batch minting queued in background worker.",
  "data": {
    "batchId": "PC-BATCH-2026-CIPLA-001",
    "mintStatus": "MINTING",
    "pollUrl": "/api/manufacturer/batch/PC-BATCH-2026-CIPLA-001"
  }
}
```

---

### 3.4 Get Batch Details & Minting Progress
Fetches detailed state, real-time worker progress, and blockchain confirmation info.

- **Endpoint**: `GET /api/manufacturer/batch/:batchId`
- **Access**: Authenticated (`Bearer <token>`)
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": {
    "id": "PC-BATCH-2026-CIPLA-001",
    "systemBatchId": "PC-BATCH-2026-CIPLA-001",
    "medicineName": "Azithromycin 500mg IP",
    "mintStatus": "MINTED",
    "totalQuantity": 50000,
    "packsMinted": 5000,
    "txHash": "0x7a8f9c1b3e4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    "blockNumber": 18431,
    "createdAt": "2026-08-23T15:10:00.000Z"
  },
  "mintProgress": {
    "total": 5000,
    "processed": 5000,
    "percent": 100,
    "status": "COMPLETED"
  }
}
```

---

### 3.5 Preview Serialized QR Tokens
Returns a pageable array of serialized pack tokens and QR preview payloads.

- **Endpoint**: `GET /api/manufacturer/batch/:batchId/preview`
- **Access**: Authenticated (`Bearer <token>`)
- **Query Parameters**: `limit` (default 20), `offset` (default 0)
- **Response `200 OK`**:
```json
{
  "status": "success",
  "batch": {
    "id": "PC-BATCH-2026-CIPLA-001",
    "medicineName": "Azithromycin 500mg IP"
  },
  "stats": {
    "totalPacks": 5000,
    "totalBoxes": 500,
    "totalCartons": 10
  },
  "packs": [
    {
      "packSerialNumber": "PC-CIPLA-001-P00001",
      "packHash": "9491a82fe7818a0328b982181b37c093a6b83f069bb24641e405f6e879a973a2",
      "qrPayload": "https://verify.pharmachain.gov.in/v1/pack?b=PC-BATCH-2026-CIPLA-001&s=00001&h=9491a82f&sig=MEQCIC..."
    }
  ]
}
```

---

### 3.6 Export Serialized QR CSVs & Print Bundles
Streams CSV files formatted for high-speed pharmaceutical packaging line printers.

- **Endpoint**: `GET /api/manufacturer/batch/:batchId/export/csv`
- **Access**: Authenticated (`Bearer <token>`)
- **Query Parameters**:
  - `type`: `packs` | `boxes` | `cartons` | `all`
- **Response**: `200 OK` (Streams `text/csv` attachment)

---

### 3.7 Regulatory Emergency Batch Recall
Quarantines all child packs across the entire pharmaceutical supply chain and writes immutable `:RECALL` state key to Hyperledger Fabric.

- **Endpoint**: `POST /api/manufacturer/batch/:batchId/recall`
- **Access**: Authenticated (`Bearer <token>`)
- **Request Body**:
```json
{
  "reason": "CDSCO Directive: Class II Quality Recall due to packaging seal integrity check",
  "action": "QUARANTINE_AND_FREEZE"
}
```
- **Response `200 OK`**:
```json
{
  "status": "success",
  "message": "Batch recalled and frozen on Hyperledger Fabric ledger.",
  "data": {
    "batchId": "PC-BATCH-2026-CIPLA-001",
    "mintStatus": "RECALLED",
    "recallReason": "CDSCO Directive: Class II Quality Recall due to packaging seal integrity check",
    "recallDate": "2026-08-23T15:45:00.000Z",
    "txHash": "0x3e4f1a2b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    "blockNumber": 18435
  }
}
```

---

### 3.8 Serialized Unit / Pack Lookup
Looks up a specific unit pack by serial number, UUID, or SHA-256 hash.

- **Endpoint**: `GET /api/manufacturer/batch/pack/lookup/:identifier`
- **Access**: Authenticated (`Bearer <token>`)
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": {
    "packId": "PC-CIPLA-001-P00001",
    "batchId": "PC-BATCH-2026-CIPLA-001",
    "medicineName": "Azithromycin 500mg IP",
    "packHash": "9491a82fe7818a0328b982181b37c093a6b83f069bb24641e405f6e879a973a2",
    "status": "ACTIVE",
    "verificationCount": 0,
    "lastKnownLocation": "Manufacturer Central Warehouse, Goa"
  }
}
```

---

## 4. Recommended Future Backend Service Extensions

To provide full end-to-end operational capabilities for warehouse logistics and quality compliance, the backend developer may implement the following supplementary endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/manufacturer/inventory` | `GET` | Return warehouse stock levels, active SKU quantities, and safety thresholds |
| `/api/manufacturer/orders` | `GET` | Return incoming B2B purchase orders from hospital and retail pharmacies |
| `/api/manufacturer/orders/:orderId/dispatch` | `POST` | Update order dispatch state and bind scanned carton barcodes |
| `/api/manufacturer/alerts` | `GET` | Return real-time quality notifications (e.g. counterfeit scan attempts) |
| `/api/manufacturer/alerts/:alertId/resolve` | `PATCH` | Acknowledge and resolve compliance alerts |
| `/api/manufacturer/analytics` | `GET` | Aggregated monthly production throughput, FEFO rotation metrics, and verification rates |

---

## 5. Standard Error Handling Response Format

All backend services should standardize JSON error output to match the frontend error interceptors:

```json
{
  "status": "error",
  "message": "Human readable description of the error",
  "code": "OPTIONAL_ERROR_CODE",
  "errors": [
    {
      "field": "licenseNumber",
      "message": "License format invalid for state jurisdiction"
    }
  ]
}
```

### HTTP Status Code Reference
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully registered.
- `202 Accepted`: Asynchronous job queued (e.g., minting workers).
- `204 No Content`: Successful action with no content returned (e.g., logout).
- `400 Bad Request`: Malformed JSON or invalid parameter syntax.
- `401 Unauthorized`: Missing or invalid Bearer token.
- `403 Forbidden`: KYC pending or insufficient administrative role.
- `404 Not Found`: Batch ID or resource does not exist.
- `409 Conflict`: Batch identifier or license number collision.
- `422 Unprocessable Entity`: Validation constraint violations.
- `500 Internal Server Error`: Unhandled server exception.
