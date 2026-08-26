# 💊 MediaCare (PharmaChain)
### Enterprise End-to-End Pharmaceutical Traceability & Anti-Counterfeit Ecosystem

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger_Fabric-v2.5-2F3134?style=for-the-badge&logo=hyperledger&logoColor=white)](https://www.hyperledger.org/use/fabric)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Summary

**MediaCare (PharmaChain)** is a production-grade, zero-trust pharmaceutical supply chain tracking and medicine authenticity platform designed to eliminate counterfeit drugs from the healthcare ecosystem. 

By unifying **ECDSA P-256 (`ES256`) cryptographic signatures**, **Hyperledger Fabric permissioned blockchain ledger**, and **high-density serialized 2D QR codes**, MediaCare establishes an unbroken, tamper-evident chain of custody from primary manufacturing lines to patient consumption.

---

## 🏛️ Comprehensive System Architecture

```mermaid
flowchart TB
    %% Styling Configuration
    classDef client fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef gateway fill:#0f172a,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef service fill:#1e1b4b,stroke:#a78bfa,stroke-width:2px,color:#f8fafc;
    classDef blockchain fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef database fill:#451a03,stroke:#fb923c,stroke-width:2px,color:#f8fafc;
    classDef security fill:#4c0519,stroke:#fb7185,stroke-width:2px,color:#f8fafc;

    %% 1. CLIENT APPLICATION LAYER
    subgraph CLIENTS["📱 1. Client Applications Layer"]
        MFR["🏭 Manufacturer Web Dashboard<br/><i>(React 18 + Vite + Redux Toolkit)</i><br/>• Batch Creation & Minting<br/>• QR Code Hub & ZIP Export<br/>• Recall & Safety Center (Form 28-A)<br/>• Fabric Ledger Explorer"]:::client
        SHOP["🏪 Shopkeeper Mobile App<br/><i>(Expo React Native + Zustand)</i><br/>• Drug License Verification<br/>• Camera Stock Intake (:INTAKE)<br/>• POS Retail Checkout (:SALE)<br/>• Automated Recall Locks"]:::client
        CUST["📱 Customer Mobile App<br/><i>(Expo React Native + Camera)</i><br/>• 1-Tap QR Authenticity Scan<br/>• 7 Verification States Engine<br/>• Geotagged CDSCO Fraud Report<br/>• Dosage & Expiry History"]:::client
    end

    %% 2. SECURITY & AUTHENTICATION
    subgraph AUTH_LAYER["🔐 2. Authentication & Cryptographic Vault"]
        FB_AUTH["🔥 Firebase Auth / Google OAuth 2.0<br/>• Identity Verification<br/>• Role Claims (MFR / SHOP / PATIENT)"]:::security
        KEY_VAULT["🔑 ECDSA P-256 Cryptographic Vault<br/>• AES-256-GCM Private Key Protection<br/>• ES256 Compact JWT Signing<br/>• JWKS Discovery (/.well-known/jwks.json)"]:::security
    end

    %% 3. API GATEWAY LAYER
    subgraph GATEWAY_LAYER["🌐 3. API Gateway & Ingress"]
        GATEWAY["🛡️ Reverse Proxy & API Gateway<br/>• JWT Bearer Token Validation<br/>• Rate Limiting & SSL Termination<br/>• Request Routing & CORS Guard"]:::gateway
    end

    %% 4. MICROSERVICES DOMAIN LAYER
    subgraph SERVICES["⚙️ 4. Microservices Domain Backend"]
        SRV_MFR["🏭 Manufacturer Service<br/>• Batch Registration & Metadata<br/>• Thermal Print Packaging Engine<br/>• Statutory CDSCO Filing Engine"]:::service
        SRV_SHOP["🏪 Pharmacy & POS Service<br/>• Wholesale Stock Intake Validation<br/>• POS Checkout & Double-Sale Check<br/>• Quarantined Inventory Manager"]:::service
        SRV_VERIFY["🔍 Verification & Provenance Engine<br/>• ES256 Signature Validation<br/>• 7-State Verification Decider<br/>• Incident & Counterfeit Logger"]:::service
        SRV_RECALL["🚨 Recall Cascade Service<br/>• Global Batch Recall Broadcast<br/>• POS Real-Time Quarantine Locks<br/>• SSE / WebSocket Incident Stream"]:::service
    end

    %% 5. DATA & CACHE LAYER
    subgraph DATA_LAYER["💾 5. Data Storage & Event Streams"]
        MONGODB[("🍃 MongoDB Database<br/>• Off-Chain Batch Catalog<br/>• Pharmacy & Drug Licenses<br/>• User Profiles & Audit Trails")]:::database
        REDIS[("⚡ Redis Cache & Message Broker<br/>• JWKS Public Key Cache<br/>• Live WebSocket / SSE Channels<br/>• Rate Limiting Counters")]:::database
    end

    %% 6. BLOCKCHAIN LEDGER LAYER
    subgraph LEDGER_LAYER["⛓️ 6. Hyperledger Fabric Permissioned Ledger (Channel: mychannel)"]
        ORDERER["📦 Raft Consensus Orderer Nodes<br/>• Block Batching & Sequencing<br/>• Block Height Sync (#18,421+)"]:::blockchain
        PEER_MFR["🏛️ Peer: Manufacturer Org<br/>• Endorses :MFG Mint Transactions"]:::blockchain
        PEER_PHARM["🏛️ Peer: Pharmacy Network Org<br/>• Endorses :INTAKE & :SALE Transitions"]:::blockchain
        PEER_REG["🏛️ Peer: CDSCO Regulatory Org<br/>• Endorses :RECALL Quarantines"]:::blockchain
        COUCHDB[("🗄️ CouchDB State Database<br/>• Key: <packHash>:MFG<br/>• Key: <packHash>:INTAKE<br/>• Key: <packHash>:SALE<br/>• Key: <batchId>:RECALL")]:::blockchain
    end

    %% CONNECTIONS & FLOWS
    MFR -->|"HTTPS / REST API"| GATEWAY
    SHOP -->|"HTTPS / REST API"| GATEWAY
    CUST -->|"HTTPS / REST API"| GATEWAY

    MFR -.->|"Sign in"| FB_AUTH
    SHOP -.->|"Google OAuth"| FB_AUTH
    CUST -.->|"Anonymous / Sign in"| FB_AUTH

    GATEWAY -->|"JWT Auth Check"| FB_AUTH
    GATEWAY -->|"Route /api/manufacturer/*"| SRV_MFR
    GATEWAY -->|"Route /api/shopkeeper/*"| SRV_SHOP
    GATEWAY -->|"Route /api/verify/*"| SRV_VERIFY
    GATEWAY -->|"Route /api/recall/*"| SRV_RECALL

    SRV_MFR -->|"Sign Tokens"| KEY_VAULT
    SRV_MFR -->|"Store Metadata"| MONGODB
    SRV_SHOP -->|"Manage Inventory"| MONGODB
    SRV_VERIFY -->|"Log Reports"| MONGODB
    SRV_VERIFY -->|"Fetch Cached JWKS"| REDIS
    SRV_RECALL -->|"Push Instant Alert"| REDIS

    REDIS -.->|"Real-Time SSE Lock"| SHOP
    REDIS -.->|"Broadcast Notice"| CUST

    %% Blockchain Connections via Fabric SDK / Gateway
    SRV_MFR -->|"Submit Tx: CreateBatch (:MFG)"| PEER_MFR
    SRV_SHOP -->|"Submit Tx: ReceivePack (:INTAKE)"| PEER_PHARM
    SRV_SHOP -->|"Submit Tx: SellPack (:SALE)"| PEER_PHARM
    SRV_RECALL -->|"Submit Tx: RecallBatch (:RECALL)"| PEER_REG

    PEER_MFR -->|"Propose Block"| ORDERER
    PEER_PHARM -->|"Propose Block"| ORDERER
    PEER_REG -->|"Propose Block"| ORDERER

    ORDERER -->|"Commit Block"| PEER_MFR
    ORDERER -->|"Commit Block"| PEER_PHARM
    ORDERER -->|"Commit Block"| PEER_REG

    PEER_MFR --- COUCHDB
    PEER_PHARM --- COUCHDB
    PEER_REG --- COUCHDB
```

---

## 🔄 End-to-End Medicine Provenance Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor MFR as 🏭 Manufacturer (MedCore)
    actor SHOP as 🏪 Retail Pharmacy (Apollo)
    actor CUST as 📱 Consumer / Patient
    participant API as 🌐 API Gateway & Services
    participant LEDGER as ⛓️ Hyperledger Fabric (mychannel)
    participant POS as 🛑 Pharmacy POS Scanner

    %% Step 1: Manufacturing
    Note over MFR,LEDGER: Phase 1: Manufacturing, ES256 Signing & Minting
    MFR->>API: POST /api/manufacturer/batch (Qty: 100,000)
    API->>API: Generate Compact JWTs (batchId, serial, exp, mfrId)
    API->>API: Sign with ECDSA P-256 Key & Compute SHA-256(JWT)
    API->>LEDGER: Chaincode Invoke: CreateBatch (<packHash>:MFG)
    LEDGER-->>API: Committed in Block #18421 (Tx: 0x8f19e4...)
    API-->>MFR: Return Downloadable QR Vector ZIP & Manifest

    %% Step 2: Distribution & Pharmacy Intake
    Note over SHOP,LEDGER: Phase 2: Logistics & Wholesale Pharmacy Intake
    MFR->>SHOP: Physical Shipment with Thermal 2D Barcodes
    SHOP->>API: POST /api/shopkeeper/intake (Scan Pack Serial #00042)
    API->>LEDGER: Query State: Check <packHash>:MFG exists & not recalled
    LEDGER-->>API: Verified Valid State
    API->>LEDGER: Chaincode Invoke: IntakePack (<packHash>:INTAKE)
    LEDGER-->>API: Committed in Block #18422 (Tx: 0x34b11f...)
    API-->>SHOP: Pack Added to Verified Store Inventory

    %% Step 3: Consumer Scan & Verification
    Note over CUST,LEDGER: Phase 3: Point-of-Sale Checkout & Consumer Verification
    CUST->>CUST: 1-Tap Camera Scan on Medicine Blister Pack
    CUST->>API: GET /api/verify?token=eyJhbGciOiJFUzI1Ni...
    API->>API: Verify ES256 Signature against JWKS Key
    API->>LEDGER: Query Composite Keys (:MFG, :INTAKE, :SALE, :RECALL)
    LEDGER-->>API: State = [MFG: OK, INTAKE: OK, SALE: NONE, RECALL: NONE]
    API-->>CUST: Display State 1: 🟢 100% Genuine & Verified Medicine

    %% Step 4: POS Sale Transition
    SHOP->>POS: Scan Pack at Checkout Counter
    POS->>API: POST /api/shopkeeper/sell (<packHash>)
    API->>LEDGER: Chaincode Invoke: SellPack (<packHash>:SALE)
    LEDGER-->>API: Committed in Block #18423 (Tx: 0x9a10bc...)
    API-->>POS: Sale Approved (Unit Marked As Consumed)

    %% Step 5: Duplicate / Clone Attempt Detection
    Note over CUST,API: Phase 4: Anti-Counterfeit & Duplicate Prevention
    actor FRAUD as 🚨 Secondary Buyer / Clone Attempt
    FRAUD->>API: GET /api/verify?token=(Same Pack #00042)
    API->>LEDGER: Query Composite Keys
    LEDGER-->>API: State contains :SALE at Block #18423
    API-->>FRAUD: Display State 3: 🟠 Warning: Already Sold Unit (Repackaging Risk)
    API->>API: Log Geotagged Incident Alert & Notify CDSCO
```

---

## 🎯 7 Consumer Verification Decision Matrix

```mermaid
graph TD
    SCAN["📱 Consumer / Scanner Reads 2D QR Code"] --> V1{"1. Is ES256 Signature Valid<br/>against Manufacturer Key?"}
    
    V1 -- "❌ No / Corrupted" --> ST6["🛑 State 6: COUNTERFEIT / INVALID SIGNATURE<br/>• Digital Signature Forged<br/>• Automatic CDSCO Fraud Incident Logged"]
    V1 -- "✅ Yes" --> V2{"2. Does :MFG Record Exist<br/>on Blockchain Ledger?"}
    
    V2 -- "❌ No" --> ST7["🟡 State 7: NOT FOUND ON LEDGER<br/>• Valid structure, but never minted on chain"]
    V2 -- "✅ Yes" --> V3{"3. Is Batch Marked with<br/>:RECALL Key?"}
    
    V3 -- "🚨 Yes" --> ST3["🔴 State 4: BATCH RECALLED (CDSCO Form 28-A)<br/>• Mandatory Quarantine Enforced<br/>• POS Terminals Lock Sale"]
    V3 -- "✅ No" --> V4{"4. Has Product Exceeded<br/>Expiry Date?"}
    
    V4 -- "⚠️ Yes" --> ST5["🔴 State 5: EXPIRED MEDICINE<br/>• Expiration threshold exceeded<br/>• Retail sale prohibited"]
    V4 -- "✅ No" --> V5{"5. Is :SALE Transition<br/>Recorded on Ledger?"}
    
    V5 -- "⚠️ Yes" --> ST2["🟠 State 3: ALREADY SOLD UNIT<br/>• Pack was previously dispensed<br/>• Counterfeit repackaging hazard alert"]
    V5 -- "✅ No" --> V6{"6. Is :INTAKE Transition<br/>Recorded at Pharmacy?"}
    
    V6 -- "✅ Yes" --> ST1["🟢 State 1: GENUINE & VERIFIED<br/>• 100% Authentic Active Stock"]
    V6 -- "📦 In Transit" --> ST4["🔵 State 2: AT REGISTERED PHARMACY<br/>• Wholesale custody confirmed"]

    classDef valid fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef warn fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#f8fafc;
    classDef danger fill:#881337,stroke:#f43f5e,stroke-width:2px,color:#f8fafc;
    classDef transit fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;

    class ST1 valid;
    class ST4 transit;
    class ST2 warn;
    class ST7 warn;
    class ST3 danger;
    class ST5 danger;
    class ST6 danger;
```

---

## 🏗️ Project Structure & Monorepo Layout

```text
MediaCare/
├── Manufacture-DashBoard/     # Enterprise Web Portal for Pharmaceutical Manufacturers
│   ├── src/
│   │   ├── components/        # Layout, StatusBadge, StatCard, DataTable, Modals
│   │   ├── features/dashboard/# 4-Layer Feature Architecture
│   │   │   ├── components/    # Header, Stats, Charts, Table, Safety, Operations
│   │   │   ├── Hooks/         # useDashboard() Custom Hook
│   │   │   ├── service/       # dashboard.api.ts (Pure Axios HTTP Calls)
│   │   │   └── slice/         # dashboard.slice.ts (Pure Synchronous Reducers)
│   │   ├── styles/            # Dual-Token Engine (tokens.scss & index.scss)
│   │   ├── store.ts           # Centralized Redux Store
│   │   └── App.tsx            # Main Orchestrator, Deep Linking & Theme Boot
│   ├── .env.example           # Frontend Environment Template
│   └── README.md              # Backend Developer API Specification Guide
│
├── shopkeeper-mobile/         # Retail Pharmacy Mobile App for Intake & Point-of-Sale (POS)
│   ├── src/
│   │   ├── services/api/      # client.ts, auth.ts, scan.ts, transactions.ts
│   │   ├── services/firebase/ # config.ts (Firebase Auth & Google Sign-In)
│   │   ├── store/             # authStore.ts, inventoryStore.ts
│   │   └── components/        # Barcode Scanner, POS Cart, Recall Banners
│   ├── app/                   # Expo Router File-Based Routing
│   └── .env.example           # Mobile Environment Template
│
├── customer-mobile/           # Consumer Mobile App for Instant Medicine Authenticity Scans
│   ├── src/
│   │   ├── config/            # firebase.ts (Consumes EXPO_PUBLIC_* env vars)
│   │   ├── services/api/      # client.ts (Sync, Verification, Fraud Reports)
│   │   └── store/             # authStore.ts, customerStore.ts, reportStore.ts
│   ├── app/                   # Expo Router Screens (scan, verification, reports)
│   └── .env.example           # Consumer App Environment Template
│
└── README.md                  # Master System Architecture Documentation
```

---

## ⚡ Tech Stack Matrix

| Layer | Manufacturer Dashboard | Shopkeeper Mobile | Customer Mobile |
|---|---|---|---|
| **Framework** | React 18 + Vite | Expo SDK 52 (React Native) | Expo SDK 52 (React Native) |
| **Language** | TypeScript 5.7 | TypeScript 5.7 | TypeScript 5.7 |
| **State Management** | Redux Toolkit 2.x | Zustand 5.x | Zustand 5.x |
| **Styling** | Tailwind CSS + SCSS Tokens | NativeWind / Tailwind CSS | StyleSheet + Lucide Native |
| **Sensors & Hardware**| Thermal Print Canvas Engine | Barcode / QR Camera Scanner | High-Speed QR Camera Scanner |
| **Cryptography** | ECDSA P-256 / SHA-256 | JWT & SHA-256 Verification | JWT & Offline Key Signature QA |
| **Security Vault** | AES-256-GCM Token Keystore | Expo SecureStore | Expo SecureStore |

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **Expo Go App**: (Optional for physical iOS / Android device testing)

---

### 1. Manufacturer Web Dashboard

```bash
# Navigate to manufacturer portal
cd Manufacture-DashBoard

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Launch local development server
npm run dev
# Dashboard opens on http://localhost:5173

# Validate TypeScript & Production Build
npm run build
```

---

### 2. Shopkeeper Mobile App

```bash
# Navigate to shopkeeper mobile project
cd shopkeeper-mobile

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start Expo development server
npx expo start -c
```
* Scan the QR code with **Expo Go** (Android) or **Camera** (iOS).

---

### 3. Customer Mobile App

```bash
# Navigate to customer mobile project
cd customer-mobile

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start Expo development server
npx expo start -c
```

---

## 🔑 Environment Configuration

Every application strictly separates environment variables and uses `.env.example` templates:

### `Manufacture-DashBoard/.env.example`
```env
VITE_API_URL=/api/manufacturer
VITE_MANUFACTURER_ID=MFR_MEDCORE_001
VITE_FABRIC_CHANNEL=mychannel
VITE_CHAINCODE_NAME=pharmacc:v2.5
```

### `shopkeeper-mobile/.env.example`
```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### `customer-mobile/.env.example`
```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

---

## 🏛️ Regulatory & Standards Compliance

* **CDSCO (Central Drugs Standard Control Organization)**: Fully formatted for statutory Form 28-D manufacturing licenses and Form 28-A batch recall declarations.
* **WHO-GMP (Good Manufacturing Practices)**: End-to-end serialized thermal label tracking and batch lineage logs.
* **US FDA 21 CFR Part 11 Equivalent**: Immutable electronic signatures, append-only transaction logs, and cryptographically signed audit trails.
* **GS1 Digital Link Compliant**: Standardized 2D matrix barcode format for secondary pharmaceutical cartons and blister packaging.

---

## 👥 Contributors & Hackathon Team

* **Project**: MediaCare (PharmaChain)
* **Team**: Himanshu & Team
* **Repository**: [Himanshu-05-dev/PharmaChain-frontend](https://github.com/Himanshu-05-dev/PharmaChain-frontend)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
