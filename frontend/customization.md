# PharmaChain (MediaCare) — Gap Analysis & Customization Blueprint

> **Reference Documentation**: `files/00` through `files/07`  
> **Target Architecture**: Microservices on Hyperledger Fabric & ECDSA P-256 (ES256)

---

## 1. System Architecture & Communication Map

```
                         [ INGRESS / NGINX / GATEWAY ]
                                       │
      ┌────────────────────────┬───────┴────────────────┬────────────────────────┐
      ▼                        ▼                        ▼                        ▼
manufacturer-service   shopkeeper-service       consumer-service            pharma-core
   (Port 3001)              (Port 3002)              (Port 3003)             (Port 4000)
      │                        │                        │                         ▲
      │ (MongoDB)              │ (MongoDB)              │ (MongoDB: reports)      │ (Keystore.json
      │                        │                        │                            + Fabric)
      └──────── X-Service-Token + RS256 Bearer JWT (Internal Calls) ──────────────┘
```

### Port & Service Responsibilities

| Service | Port | Database / Storage | Auth / Security | Primary Role |
|---|---|---|---|---|
| **`pharma-core`** | `4000` | Encrypted `keystore.json` + Fabric Ledger | `X-Service-Token` + RS256 Bearer | Cryptographic trust root, ES256 pack signing, Fabric chaincode transitions, JWKS endpoint |
| **`manufacturer-service`** | `3001` | MongoDB (`manufacturers`, `batches`, `packs`) | JWT (httpOnly) + KYC Approval Gate | Batch lifecycle, Tier 1/2 metadata, async 1-lakh pack mint worker, QR CSV exports |
| **`shopkeeper-service`** | `3002` | MongoDB (`shopkeepers`, `inventories`, `packevents`)| JWT with Drug License validation | Retail intake scan (`AT_SHOP`), sale scan (`SOLD`), duplicate guard, inventory aggregation |
| **`consumer-service`** | `3003` | MongoDB (`reports` only) | **Zero-Auth (Public)** | 1-second public scan verification, 7-state decider, counterfeit incident reporting |

---

## 2. Dual-Mode QR Code Specification

$$\mathbf{\text{https://pharmachain.gov.in/verify/}}\underbrace{\mathbf{:packHash}}_{\text{Path Param}}\mathbf{?token=}\underbrace{\mathbf{:signedToken}}_{\text{Query Param}}$$

* **Mode 1 (Native Camera / Google Lens)**: The phone recognizes the HTTPS URL and opens the web verification page directly.
* **Mode 2 (Mobile App Scanner)**: The in-app scanner extracts `:packHash` directly from the URL path (`/verify/:packHash`), instantly querying on-chain status.

---

## 3. The 7 Verification States Matrix

| State | Condition / Ledger Status | Meaning | UI Treatment |
|---|---|---|---|
| `GENUINE` | Valid ES256 signature, not expired, state = `MINTED` | Minted by manufacturer, not yet sold | ✅ Green Banner |
| `AT_SHOP` | Valid ES256 signature, not expired, state = `AT_SHOP` | In stock at a verified pharmacy | ✅ Green Banner (Info: In stock) |
| `ALREADY_SOLD` | Valid signature, but ledger state = `SOLD` | Already dispensed at retail POS (Potential QR clone) | ⚠️ Red Banner — Reused QR Alert |
| `RECALLED` | Valid signature, ledger state = `RECALLED` | Manufacturer/CDSCO emergency recall triggered | 🚨 Red Banner — Block Consumption |
| `EXPIRED` | Current timestamp > `expiryDate` | Shelf-life expired | ⚠️ Amber/Red — Block Consumption |
| `COUNTERFEIT` | Signature verification failed on `pharma-core` | Invalid signature / Key mismatch | 🚨 Red Banner — Counterfeit Drug |
| `NOT_FOUND` | Token well-formed but not found on-chain | Genesis mint record missing | 🚨 Red Banner — Unregistered Drug |

---

## 4. API Specification & Route Mapping

### A. `pharma-core` (Port `4000`)
* `POST /core/keys/manufacturer` — Provision manufacturer EC P-256 keypair
* `POST /core/mint/batch` — Sign $N$ packs (CSPRNG nonce + timestamp)
* `POST /core/verify` — Verify ES256 signature and expiry
* `GET /core/ledger/pack/:packId` — Query current custody state
* `POST /core/ledger/transition` — Submit single state transition (`MINTED`, `AT_SHOP`, `SOLD`)
* `POST /core/ledger/transition/batch` — Submit chunked state transitions (250 items/chunk)
* `POST /core/ledger/recall/:batchId` — Atomic batch recall on ledger
* `GET /.well-known/jwks.json` — Public JWKS key discovery
* `GET /core/health`, `/healthz`, `/readyz` — Health and readiness probes

### B. `manufacturer-service` (Port `3001`)
* `POST /api/manufacturer/register` — Manufacturer registration with KYC upload
* `POST /api/manufacturer/login` — JWT login
* `POST /api/manufacturer/batch` — Create batch record (Tier 2 metadata)
* `POST /api/manufacturer/batch/:batchId/mint` — Async mint trigger (`202 Accepted`)
* `GET /api/manufacturer/batch/:batchId` — Batch details and live minting progress
* `GET /api/manufacturer/batch/:batchId/export/csv?type=packs|boxes|cartons` — Download QR CSVs
* `POST /api/manufacturer/batch/:batchId/recall` — Trigger emergency recall
* `GET /api/manufacturer/batch/public/:batchId` — Public consumer-safe metadata

### C. `shopkeeper-service` (Port `3002`)
* `POST /api/shopkeeper/login` — Chemist login
* `POST /api/shopkeeper/refresh` — Token refresh
* `POST /api/shopkeeper/scan/intake` — Intake delivery scan with duplicate guard
* `POST /api/shopkeeper/scan/sale` — POS checkout scan (`AT_SHOP -> SOLD`)
* `GET /api/shopkeeper/inventory` — Pre-aggregated inventory with expiry/low-stock alerts

### D. `consumer-service` (Port `3003`)
* `GET/POST /api/consumer/verify` — Zero-auth public verification (extracts `:packHash` and `token`)
* `POST /api/consumer/report` — Submit counterfeit incident with geotag and device timestamp
* `GET /healthz` — Health check

---

## 5. Identified Gaps & Required Fixes

| Area | Current Implementation in Workspace | Target Specification | Required Action |
|---|---|---|---|
| **Backend Services** | Only frontend client mocks exist | 4 Node.js microservices (`:4000`, `:3001`, `:3002`, `:3003`) | Scaffold and implement the 4 backend services |
| **Consumer Scan Auth** | `customer-mobile` uses Firebase auth token interceptor on `/user/sync` | Zero-Auth public endpoint on `consumer-service:3003` | Remove Firebase auth requirement from public scan flow |
| **Shopkeeper Scan Routes**| `shopkeeper-mobile` calls legacy `/api/v1/scan/shopkeeper` & `/api/v1/transactions/*` | `POST /api/shopkeeper/scan/intake` and `/sale` on `:3002` | Align API clients to parse full QR URLs and call correct microservice endpoints |
| **Manufacturer API** | `Manufacture-DashBoard` uses mock data & static endpoints | Dynamic async minting (`202 Accepted`) & polling on `:3001` | Connect dashboard to live `manufacturer-service` |

---

## 6. Implementation Roadmap

```text
PHASE 1 — Backend Architecture & Core Services Setup
1. Scaffold 4 microservice repositories/directories (pharma-core, manufacturer-service, shopkeeper-service, consumer-service).
2. Implement pharma-core cryptographic vault (ECDSA P-256, AES-256-GCM keystore, ES256 pack signing).
3. Implement pharma-core Fabric ledger bridge (transitions: MINTED, AT_SHOP, SOLD, RECALLED).
4. Expose /.well-known/jwks.json and /core/verify on pharma-core.

PHASE 2 — Microservice APIs & Business Logic
1. Build manufacturer-service (Batches, Dual IDs, Async Minting Worker, CSV Export, Recall).
2. Build shopkeeper-service (Duplicate intake guard, AT_SHOP check before sale, Inventory aggregation).
3. Build consumer-service (Zero-auth 7-state evaluator, Counterfeit incident logger).

PHASE 3 — Frontend Integration & Alignment
1. customer-mobile: Align to consumer-service (:3003) zero-auth verify and report APIs.
2. shopkeeper-mobile: Align to shopkeeper-service (:3002) intake and sale scan APIs.
3. Manufacture-DashBoard: Align to manufacturer-service (:3001) batch creation, minting, and export APIs.

PHASE 4 — End-to-End Verification
1. Mint Batch -> Intake Delivery -> POS Sale -> Consumer Verification -> Counterfeit Rejection -> Recall Cascade.
```
