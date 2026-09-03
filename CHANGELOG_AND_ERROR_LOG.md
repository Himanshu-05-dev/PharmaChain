# 📋 PharmaChain: Error Log, Root Cause Analyses & Complete Changelog
### Smart India Hackathon (SIH 2026) | Comprehensive System Remediation & Evolution Report

---

## 📑 Table of Contents

1. [Executive Summary & Problem-Solution Matrix](#1-executive-summary--problem-solution-matrix)
2. [Frontend Fixes & Enhancements (`frontend/`)](#2-frontend-fixes--enhancements-frontend)
   - [2.1 Shopkeeper Mobile Application (`shopkeeper-mobile`)](#21-shopkeeper-mobile-application-shopkeeper-mobile)
   - [2.2 Consumer Mobile Application (`customer-mobile`)](#22-consumer-mobile-application-customer-mobile)
   - [2.3 Manufacturer Web Dashboard (`Manufacture-DashBoard`)](#23-manufacturer-web-dashboard-manufacture-dashboard)
   - [2.4 Admin Regulatory Dashboard (`Admin-DashBoard`)](#24-admin-regulatory-dashboard-admin-dashboard)
3. [Backend Microservices Fixes & Architecture Updates (`server/`)](#3-backend-microservices-fixes--architecture-updates-server)
   - [3.1 High-Performance LAN TCP Proxy Bridge (`lan-bridge.js`)](#31-high-performance-lan-tcp-proxy-bridge-lan-bridgejs)
   - [3.2 Cryptographic Vault Engine (`pharma-core`)](#32-cryptographic-vault-engine-pharma-core)
   - [3.3 Manufacturer Microservice (`manufacturer-service`)](#33-manufacturer-microservice-manufacturer-service)
   - [3.4 Shopkeeper & Retail Microservice (`shopkeeper-service`)](#34-shopkeeper--retail-microservice-shopkeeper-service)
   - [3.5 Kubernetes & Skaffold Ingress Configuration](#35-kubernetes--skaffold-ingress-configuration)
4. [Blockchain & Distributed Ledger Fixes (`blockchain-server/`)](#4-blockchain--distributed-ledger-fixes-blockchain-server)
   - [4.1 Spring Boot REST Gateway (`pharma-backend`) Networking](#41-spring-boot-rest-gateway-pharma-backend-networking)
   - [4.2 Hyperledger Fabric 2.5 Consensus & Smart Contracts](#42-hyperledger-fabric-25-consensus--smart-contracts)
5. [Master Error-to-Resolution Matrix](#5-master-error-to-resolution-matrix)

---

## 1. Executive Summary & Problem-Solution Matrix

During end-to-end integration across the **5 Frontends**, **5 Kubernetes Microservices**, and **Hyperledger Fabric Blockchain**, several critical edge-case errors were diagnosed, isolated, and remediated:

```
┌───────────────────────────────────────────────┬─────────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Issue Observed                                │ Root Cause Identified                           │ Architectural Remediation Applied                      │
├───────────────────────────────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Mobile "Network Error" on Physical Phone   │ Phone over Wi-Fi (192.168.x.x) cannot reach     │ Created high-performance TCP LAN Bridge proxy daemon   │
│                                               │ K8s port-forwards bound strictly to 127.0.0.1.  │ bridging 192.168.x.x -> K8s ports 3001-3005 & 4000.    │
├───────────────────────────────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. "Counterfeit Warning / INVALID-SIGNATURE"  │ Unminted batches fell back to a dummy simulated │ Enforced strict live ES256 QR rendering, added auto-  │
│    (0/100 Trust Score) on Mobile Scanner      │ placeholder string with fake signature suffix.  │ key provisioning, and blocked fake QR generation.      │
├───────────────────────────────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Batches Stuck in "PENDING" State           │ (a) MINT_STATUS was an Array vs Enum object.    │ (a) Directly set batch.mintStatus = 'MINTED'.          │
│                                               │ (b) Manufacturer account lacked EC private key. │ (b) Auto-generate EC P-256 keys on the fly in backend.│
├───────────────────────────────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. CSV Manifest Truncated at 100 Rows         │ Hardcoded Math.min(..., 100) cap & S3 redirect  │ Replaced 302 redirect with direct CSV stream & raised  │
│    When Volume was 200 Packs                  │ behavior in export controller and web client.   │ pagination caps to 1000 in preview & export routes.    │
├───────────────────────────────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 5. Shopkeeper Mobile Populated with Mock Data │ UI screens were reading static constants rather │ Replaced hardcoded arrays with live REST API queries,  │
│    & Scanned Medicines Not Adding to Inventory│ than connecting to shopkeeper-service API.      │ added useFocusEffect auto-refresh on camera scan.      │
├───────────────────────────────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 6. Spring Boot Docker JWKS Connection Error   │ pharma-backend container attempted connecting   │ Configured PHARMA_CORE_JWKS_URL with host gateway IP   │
│    (HttpURLConnection.connect UnknownHost)    │ to pharma-core:4000 outside Docker network.     │ and added extra_hosts in docker-compose.yml.           │
└───────────────────────────────────────────────┴─────────────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Fixes & Enhancements (`frontend/`)

### 2.1 Shopkeeper Mobile Application (`shopkeeper-mobile`)

* **Problem**:
  1. The app displayed static dummy medicine arrays (`INVENTORY_DATA`) instead of displaying real inventory from the backend.
  2. Scanned medicine blisters were not showing up in the inventory table.
  3. Scanning on a physical device failed with `Network Error` due to `localhost` resolution issues on Android/iOS.
* **Changes Made**:
  1. **Dynamic Host Resolution** (`src/services/api/client.ts`):
     - Added dynamic `Constants.expoConfig?.hostUri` / `window.location.hostname` parser to automatically point API traffic to the host computer's active LAN Wi-Fi IP (`192.168.1.9:3002`).
  2. **Live Backend Synchronization** (`app/(shopkeeper)/inventory.tsx`):
     - Removed hardcoded mock array `INVENTORY_DATA`.
     - Integrated `getInventory()` service call.
     - Added React Navigation `useFocusEffect` so whenever a chemist returns from the camera scanner, the inventory list auto-refreshes seamlessly.
     - Added pull-to-refresh (`RefreshControl`).
  3. **Dashboard & History Sync** (`app/(shopkeeper)/dashboard.tsx` & `transactions.tsx`):
     - Connected `getStats()` and `getHistory()` to display live daily volume, total inventory units, and blockchain transactions.
  4. **Inbound & Verification Screen** (`app/verification.tsx`):
     - Enhanced error handling for `DUPLICATE_INTAKE (409 Conflict)`, `ALREADY_SOLD`, and `INVALID_SIGNATURE`.

---

### 2.2 Consumer Mobile Application (`customer-mobile`)

* **Problem**:
  - Scanning medicines on physical patient devices failed with connection timeouts.
* **Changes Made**:
  1. **Dynamic Host Resolution** (`src/services/api/client.ts`):
     - Implemented dynamic IP resolution pointing to `consumer-service` (`http://192.168.1.9:3003`).
  2. **Authenticity Score & Leaflet UI**:
     - Connected verification results to display genuine manufacturer identity, CDSCO schedule, and live recall status.

---

### 2.3 Manufacturer Web Dashboard (`Manufacture-DashBoard`)

* **Problem**:
  1. Batches were created in `PENDING` state and required separate manual steps.
  2. QR Hub showed placeholder QRs with fake signatures (`MEUCIQDxxxx...`) which failed when scanned on mobile.
  3. CSV downloads were capped at 100 rows even when 200 packs were minted.
* **Changes Made**:
  1. **Auto-Mint Batch Creation** (`src/features/dashboard/Hooks/dashboard.hooks.ts`):
     - Updated `registerNewBatch` to immediately set `mintStatus = 'MINTED'` and initialize `packsMinted = totalQuantity`.
  2. **Strict Live Cryptographic QR Hub** (`src/components/qr/QRCodeHubView.tsx`):
     - Removed the dummy fallback string `MEUCIQDxxxx_simulated_es256_signature...`.
     - Added status indicator badge: `● Live Authenticated QR` vs `○ Mint Required`.
     - Added 1-click **"Copy Live Scan URL"** and **"Copy Signed Token"**.
  3. **Batches Table 1-Click Mint** (`src/components/batches/BatchesView.tsx`):
     - Added 1-click **Sparkle Mint** action button for any pending batches.
  4. **Security Tab Preview** (`src/components/batches/BatchDetailsModal.tsx`):
     - Connected live signed packs preview from `pharma-core`.
  5. **CSV Full Stream** (`src/features/dashboard/service/dashboard.api.ts`):
     - Removed `Math.min(..., 100)` limit caps.

---

### 2.4 Admin Regulatory Dashboard (`Admin-DashBoard`)

* **Changes Made**:
  - Updated API clients to correctly communicate with `admin-service` (`:3005`).
  - Verified manufacturer KYC approval workflow (`POST /api/manufacturer/auth/kyc/approve`) with administrative security tokens.

---

## 3. Backend Microservices Fixes & Architecture Updates (`server/`)

### 3.1 High-Performance LAN TCP Proxy Bridge (`lan-bridge.js`)

* **Problem**:
  - Kubernetes / Minikube port-forwarding binds strictly to `127.0.0.1` (loopback). Physical Android and iOS devices on the local Wi-Fi network (`192.168.x.x`) could not connect to `3001`, `3002`, `3003`, or `4000`, resulting in `Network Error`.
* **Solution**:
  - Built [server/scripts/lan-bridge.js](file:///d:/Hackathon/SIH-Pharma/server/scripts/lan-bridge.js): A zero-dependency Node.js TCP proxy daemon that binds to `0.0.0.0` (all network interfaces) and pipes incoming mobile Wi-Fi packets directly to local Kubernetes ports:
    - `192.168.1.9:3001` $\to$ `127.0.0.1:3001` (`manufacturer-service`)
    - `192.168.1.9:3002` $\to$ `127.0.0.1:3002` (`shopkeeper-service`)
    - `192.168.1.9:3003` $\to$ `127.0.0.1:3003` (`consumer-service`)
    - `192.168.1.9:3005` $\to$ `127.0.0.1:3005` (`admin-service`)
    - `192.168.1.9:4000` $\to$ `127.0.0.1:4000` (`pharma-core-service`)

---

### 3.2 Cryptographic Vault Engine (`pharma-core`)

* **Problem**:
  - Unregistered manufacturers or existing accounts created before key vault initialization returned `KEY_NOT_FOUND`.
* **Solution**:
  - Implemented automatic EC NIST P-256 keypair generation in `coreClient.service.js`.
  - Maintained AES-256-GCM master vault key sealing and RFC 7517 JWKS discovery server (`/.well-known/jwks.json`).

---

### 3.3 Manufacturer Microservice (`manufacturer-service`)

* **Problem**:
  1. In `batch.controller.js`, `MINT_STATUS` was an Array (`['PENDING', 'MINTING', 'MINTED', 'RECALLED']`), so `batch.mintStatus = MINT_STATUS.MINTED` evaluated to `undefined`, reverting batches to `PENDING`.
  2. Batch creation did not trigger cryptographic signing automatically.
  3. `exportBatchCsvController` used 302 redirect headers instead of directly streaming the CSV file.
* **Changes Made**:
  1. **Direct Mint Assignment** (`src/controllers/batch.controller.js`):
     - Corrected `batch.mintStatus = 'MINTED'`.
     - Integrated `mintBatchViaPharmaCore` directly inside `createBatchController` so every new batch is minted upon creation.
  2. **Parameter Flexibility** (`src/services/coreClient.service.js`):
     - Updated `mintBatchViaPharmaCore` to accept both `quantity` and `totalQuantity`.
     - Added auto-provisioning retry logic for `KEY_NOT_FOUND`.
  3. **Direct CSV Streaming** (`src/controllers/batch.controller.js`):
     - Updated `exportBatchCsvController` to stream the raw CSV manifest via `fetchBatchCsvStreamViaPharmaCore`.
     - Raised preview limit caps from 200 to 1000.

---

### 3.4 Shopkeeper & Retail Microservice (`shopkeeper-service`)

* **Problem**:
  - Inbound intake scans were not persisting `medicineName`, causing new items in the mobile inventory to appear blank.
* **Changes Made**:
  1. **Intake Scanner Controller** (`src/controllers/scan.controller.js`):
     - Updated `intakeScanController` to extract `payload.medicineName` from the verified JWT payload and upsert complete medicine details into the inventory collection.
  2. **Duplicate Intake Rejection**:
     - Added duplicate scan check returning `409 Conflict` with `DUPLICATE_INTAKE` code if a pack has already been scanned into inventory.
  3. **Inventory & Stats Controllers** (`src/controllers/shopkeeper.controller.js`):
     - Added computed fields: `currentStock`, `isLowStock`, `isExpiringSoon`.

---

### 3.5 Kubernetes & Skaffold Ingress Configuration

* **Changes Made**:
  - Updated `server/skaffold.yml` portForward rules to bind to `address: 0.0.0.0`.
  - Added npm script `"lan-bridge": "node scripts/lan-bridge.js"` in `server/package.json`.

---

## 4. Blockchain & Distributed Ledger Fixes (`blockchain-server/`)

### 4.1 Spring Boot REST Gateway (`pharma-backend`) Networking

* **Problem**:
  - When the Spring Boot gateway started in Docker, it attempted to connect to `PHARMA_CORE_JWKS_URL=http://pharma-core:4000/.well-known/jwks.json`.
  - Because `pharma-core` was running in Kubernetes on the host machine, the Docker container failed to resolve `pharma-core:4000`, causing `HttpURLConnection.connect` UnknownHost / Connection Refused errors.
* **Changes Made**:
  1. **Environment Configuration** (`blockchain-server/.env`):
     - Updated `PHARMA_CORE_JWKS_URL=http://host.docker.internal:4000/.well-known/jwks.json`.
  2. **Docker Compose Gateway Resolution** (`blockchain-server/docker-compose.yml`):
     - Added `extra_hosts` to `pharma-backend`:
       ```yaml
       extra_hosts:
         - "host.docker.internal:host-gateway"
         - "pharma-core:host-gateway"
       ```
     - Enables the Spring Boot OAuth2 Nimbus JWT decoder to fetch public keys directly from the host.

---

### 4.2 Hyperledger Fabric 2.5 Consensus & Smart Contracts

* **Verified**:
  - `pharmacc.jar` Java chaincode state machine transitions:
    - Genesis transition: `:MINTED`
    - Chemist reception: `:AT_SHOP` / `:INTAKE`
    - POS sale: `:SOLD`
    - Regulatory recall: `:RECALLED`
  - Verified Raft single-node orderer consensus and CouchDB world state indexing.

---

## 5. Master Error-to-Resolution Matrix

| # | Error Message / Symptom | Component | Root Cause | Exact Resolution |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `Network Error` on mobile scan | Mobile Apps | Phone cannot reach `127.0.0.1` | Added `lan-bridge.js` TCP proxy on ports `3001-3005, 4000`. |
| **2** | `INVALID_SIGNATURE` (0/100 Trust Score) | QR Hub / Scanner | Unminted batches used fake signature string | Only render real minted QRs, auto-mint on batch creation. |
| **3** | Batches stuck in `PENDING` | Manufacturer Svc | `MINT_STATUS.MINTED` was undefined on array | Fixed `batch.mintStatus = 'MINTED'` in controller. |
| **4** | `KEY_NOT_FOUND` in pharma-core | pharma-core | Manufacturer had no EC key in keystore | Added automatic `generateKeyForManufacturer` retry logic. |
| **5** | CSV export truncated at 100 rows | Manufacturer Svc | Hardcoded `Math.min(..., 100)` cap | Removed limit caps & enabled direct CSV streaming. |
| **6** | Blank item name in mobile inventory | Shopkeeper Svc | `payload.medicineName` not extracted | Extracted `medicineName` from verified JWT payload. |
| **7** | `HttpURLConnection.connect` in Java | Blockchain Gateway | Container could not resolve `pharma-core:4000` | Configured `host.docker.internal` + `extra_hosts` in compose. |
| **8** | Duplicate scans accepted into stock | Shopkeeper Svc | Missing check for existing intake event | Added duplicate check returning `409 DUPLICATE_INTAKE`. |

---

<div align="center">
  <sub>PharmaChain Engineering Documentation | Smart India Hackathon (SIH 2026)</sub>
</div>
