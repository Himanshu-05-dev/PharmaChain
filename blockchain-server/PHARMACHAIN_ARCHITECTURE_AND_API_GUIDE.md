# PharmaChain: Architecture, Consensus & Complete API Flow Guide

This document provides a comprehensive, end-to-end breakdown of the **PharmaChain Blockchain Microservice**. It details the system architecture, container topology, Hyperledger Fabric consensus pipeline, cryptographic setup, smart contract state machine, and **visual Mermaid sequence flow diagrams for every API endpoint**.

---

## 📑 Table of Contents

1. [Executive Overview & Problem Statement](#1-executive-overview--problem-statement)
2. [End-to-End System Architecture](#2-end-to-end-system-architecture)
3. [Container Topology & Startup Sequence](#3-container-topology--startup-sequence)
4. [Smart Contract State Machine & Rules Engine](#4-smart-contract-state-machine--rules-engine)
5. [Security & Authentication Flow](#5-security--authentication-flow)
6. [Hyperledger Fabric Transaction Lifecycle (Consensus Flow)](#6-hyperledger-fabric-transaction-lifecycle-consensus-flow)
7. [Comprehensive API Reference & Sequence Diagrams](#7-comprehensive-api-reference--sequence-diagrams)
   - [7.1 Record Single Transition (`POST /api/transition`)](#71-record-single-transition-post-apitransition)
   - [7.2 Record Batch Transitions (`POST /api/transition/batch`)](#72-record-batch-transitions-post-apitransitionbatch)
   - [7.3 Recall Medicine Batch (`POST /api/transition/recall`)](#73-recall-medicine-batch-post-apitransitionrecall)
   - [7.4 Evaluate Pack Status with Recall Priority (`GET /api/transition/status`)](#74-evaluate-pack-status-with-recall-priority-get-apitransitionstatus)
   - [7.5 Get Current Pack State (`GET /api/transition/pack/{hash}/current`)](#75-get-current-pack-state-get-apitransitionpackhashcurrent)
   - [7.6 Get Immutable Pack History (`GET /api/transition/pack/{hash}/history`)](#76-get-immutable-pack-history-get-apitransitionpackhashhistory)
   - [7.7 Query Specific Transition by Hash (`GET /api/transition/{hash}`)](#77-query-specific-transition-by-hash-get-apitransitionhash)
   - [7.8 Rich CouchDB Selector Query (`GET /api/transition`)](#78-rich-couchdb-selector-query-get-apitransition)
   - [7.9 Actuator Health Check (`GET /actuator/health`)](#79-actuator-health-check-get-actuatorhealth)
8. [Storage & Ledger Key Schema](#8-storage--ledger-key-schema)
9. [Operational Cheat Sheet (Docker Commands)](#9-operational-cheat-sheet-docker-commands)

---

## 1. Executive Overview & Problem Statement

PharmaChain solves pharmaceutical counterfeiting, gray-market diversion, front-running, and recall latency by establishing an **immutable, distributed custody ledger**.

### Key Value Propositions
* **Serial-Level Provenance**: Every medicine pack is tracked from creation (`MINTED`), custody handover (`INTAKE` / `AT_SHOP`), to final consumer purchase (`SOLD`).
* **Double-Spending & Anti-Clone Shield**: A medicine unit cannot be sold twice or split into duplicate streams. Once marked `SOLD`, the ledger permanently locks the unit.
* **Front-Running Prevention**: A retailer cannot register a sale unless the unit was previously recorded as received (`AT_SHOP` / `INTAKE`).
* **Instant Batch Recalls**: If a batch is compromised (e.g. temperature excursion or contamination), a single recall transaction immediately flags every unit belonging to that batch across the entire supply chain.

---

## 2. End-to-End System Architecture

```mermaid
graph TB
    subgraph "External Clients & Gateway Ecosystem"
        Client["Mobile App / Web Dashboard / Barcode Scanner"]
        PharmaCore["Pharma-Core Auth Server (JWKS)"]
    end

    subgraph "PharmaChain Docker Compose Infrastructure"
        subgraph "Spring Boot REST Gateway (:8080)"
            SecFilter["Spring Security (OAuth2 / JWT)"]
            Controller["TransitionController"]
            FabGateway["Fabric Java SDK Gateway Client"]
        end

        subgraph "Hyperledger Fabric Network (:pharma-fabric)"
            Peer["peer0.org1.example.com (:7051, :7052)<br/>Endorser & Ledger Validator"]
            CouchDB["couchdb0 (:5984)<br/>Rich Query State Database"]
            Orderer["orderer.example.com (:7050)<br/>Raft Ordering Service"]
            CAOrg1["ca.org1.example.com (:7054)"]
            CAOrderer["ca.orderer.example.com (:9054)"]
            CC["pharmacc.jar (Chaincode)<br/>Java Contract Interface"]
        end
    end

    Client -->|1. HTTPS Request + Bearer JWT| SecFilter
    SecFilter -.->|Fetch & Validate Keys| PharmaCore
    SecFilter --> Controller
    Controller --> FabGateway
    FabGateway -->|2. gRPC + mutual TLS (Proposal)| Peer
    Peer <-->|Read / Write World State| CouchDB
    Peer -->|Execute Java Smart Contract| CC
    FabGateway -->|3. Broadcast Endorsed Tx| Orderer
    Orderer -->|4. Deliver Block with Transactions| Peer
```

---

## 3. Container Topology & Startup Sequence

When you execute `docker compose up --build -d`, services initialize in a strictly governed topological order:

```mermaid
sequenceDiagram
    autonumber
    participant SetupCrypto as fabric-setup-crypto
    participant Infra as CAs, CouchDB, Orderer, Peer
    participant BuildCC as fabric-build-chaincode
    participant SetupChannel as fabric-setup-channel
    participant Backend as pharma-backend (:8080)

    Note over SetupCrypto: Runs cryptogen & configtxgen
    SetupCrypto->>SetupCrypto: Generate Org1 & Orderer TLS/MSP certs
    SetupCrypto->>SetupCrypto: Generate mychannel.block (Genesis Block)
    SetupCrypto-->>Infra: Certs & Genesis Block ready

    par Start Infrastructure
        Infra->>Infra: Launch ca.org1, ca.orderer, couchdb0
        Infra->>Infra: Launch orderer.example.com (Genesis block loaded)
        Infra->>Infra: Launch peer0.org1.example.com (Connected to CouchDB)
    and Build Chaincode
        BuildCC->>BuildCC: gradle shadowJar --no-daemon
        BuildCC->>BuildCC: Output /chaincode/build/libs/pharmacc.jar
    end

    Note over SetupChannel: Waits for Peer, Orderer, and JAR build
    SetupChannel->>Infra: Fetch channel block & Join peer to 'mychannel'
    SetupChannel->>SetupChannel: Build .tar.gz package (metadata.json + chaincode.jar)
    SetupChannel->>Infra: Install chaincode on peer0.org1
    SetupChannel->>Infra: Approve chaincode definition for Org1MSP
    SetupChannel->>Infra: Commit chaincode definition to channel
    SetupChannel-->>Backend: Channel & Chaincode Ready (Exit 0)

    Note over Backend: Starts Spring Boot Gateway
    Backend->>Infra: Establishes gRPC TLS connection via User1@org1.example.com
    Backend->>Backend: Exposes REST Endpoints on http://localhost:8080
```

---

## 4. Smart Contract State Machine & Rules Engine

The Java smart contract (`PharmaContract.java`) governs all transitions with the following state machine:

```mermaid
stateDiagram-v2
    [*] --> MINTED: Initial Genesis Event (fromId=GENESIS)
    
    MINTED --> INTAKE: Distributor / Pharmacy Receives Pack
    MINTED --> AT_SHOP: Pharmacy Stocks Pack
    
    INTAKE --> AT_SHOP: Handover to Shelf
    INTAKE --> SOLD: Direct Sale (Valid Custody)
    AT_SHOP --> SOLD: Consumer Purchase (Terminal State)

    MINTED --> RECALLED: Batch Recall Triggered
    INTAKE --> RECALLED: Batch Recall Triggered
    AT_SHOP --> RECALLED: Batch Recall Triggered

    SOLD --> DoubleSpendingViolation: Reject! (Pack already sold)
    SOLD --> [*]
    RECALLED --> [*]
```

### Smart Contract Invariants
1. **Genesis Enforcement**: A pack *must* start with `MINTED` (or `MFG`). No item can jump directly to `INTAKE` or `SOLD`.
2. **Anti-Double-Spend**: Once a pack reaches `SOLD`, any subsequent transaction on that pack throws `ALREADY_SOLD`.
3. **Custody Verification**: In `SOLD` events, `fromId` must match the current owner recorded in `toId` of the preceding `AT_SHOP`/`INTAKE` event.
4. **Batch Recall Precedence**: Whenever any operation or query touches a pack, the chaincode queries `batchId:RECALLED`. If present, the status is immediately locked as **Recalled**.

---

## 5. Security & Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Frontend / Scanner Client
    participant AuthServer as Pharma-Core Auth (JWKS)
    participant SecFilter as Spring Security OAuth2 Filter
    participant Controller as TransitionController
    participant Fabric as Fabric Gateway (X.509 MSP)

    Note over Client: 1. User logs in on Pharma-Core
    Client->>AuthServer: Authenticate (Credentials)
    AuthServer-->>Client: Return signed JWT (iss: pharma-core, aud: pharma-backend)

    Note over Client: 2. Protected API Call
    Client->>SecFilter: HTTP POST /api/transition + Authorization: Bearer <JWT>
    SecFilter->>AuthServer: Retrieve JWKS public keys (.well-known/jwks.json)
    SecFilter->>SecFilter: Validate Signature, Expiration, Issuer & Audience
    
    alt Token Valid
        SecFilter->>Controller: Allow Request Execution
        Controller->>Fabric: Sign gRPC proposal using User1@org1.example.com X.509 cert
        Fabric-->>Controller: Return Ledger Commit Response
        Controller-->>Client: 200 OK + JSON Payload
    else Token Invalid / Missing
        SecFilter-->>Client: 401 Unauthorized (Invalid JWT Token)
    end
```

---

## 6. Hyperledger Fabric Transaction Lifecycle (Consensus Flow)

Every write API (`POST /api/transition`, `POST /api/transition/batch`, `POST /api/transition/recall`) executes through Hyperledger Fabric's **Execute-Order-Validate** consensus model:

```mermaid
sequenceDiagram
    autonumber
    participant Gateway as Spring Boot Fabric Gateway
    participant Peer as Peer Node (peer0.org1.example.com)
    participant CC as Java Chaincode (pharmacc)
    participant Orderer as Raft Orderer (orderer.example.com)
    participant CouchDB as CouchDB World State

    Note over Gateway,CC: Phase 1: Endorsement (Execution & Simulation)
    Gateway->>Peer: Send signed Transaction Proposal (gRPC TLS)
    Peer->>CC: Invoke target method (e.g. recordTransition)
    CC->>CouchDB: Read current state (packId:CURRENT, batchId:RECALLED)
    CC->>CC: Run validation rules (Custody, Genesis, Double-spend)
    CC-->>Peer: Return Read/Write Set (RWSet) & Return Value
    Peer->>Peer: Sign proposal response with Peer Org1MSP private key
    Peer-->>Gateway: Return ProposalResponse (Endorsement)

    Note over Gateway,Orderer: Phase 2: Ordering (Consensus & Block Packaging)
    Gateway->>Orderer: Broadcast Transaction Payload + Endorsement Envelope
    Orderer->>Orderer: Order transactions chronologically into a Raft Block

    Note over Orderer,CouchDB: Phase 3: Validation & Ledger Commit
    Orderer->>Peer: Deliver new Block via gRPC stream
    Peer->>Peer: Check VSCC (Validation System Chaincode) & Signatures
    Peer->>Peer: Check MVCC (Multi-Version Concurrency Control) conflict
    Peer->>Peer: Append block to immutable Blockchain Ledger file
    Peer->>CouchDB: Commit Read/Write set to CouchDB World State
    Peer-->>Gateway: Emit Commit Status Event (SUCCESS)
    Gateway-->>Gateway: Complete Future & Return response to HTTP caller
```

---

## 7. Comprehensive API Reference & Sequence Diagrams

---

### 7.1 Record Single Transition (`POST /api/transition`)

Records a single lifecycle transition for a specific medicine unit pack.

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as TransitionController
    participant Contract as PharmaContract (Java Chaincode)
    participant State as Ledger & CouchDB

    Client->>Controller: POST /api/transition { packId, eventType, fromId, toId, sellingDate, sellingTime, sellerId }
    Controller->>Controller: normalizeEventType(eventType) & resolvePackAndEvent()
    Controller->>Contract: submitTransaction("recordTransition", packId, eventType, fromId, toId, date, time, sellerId)
    
    Contract->>State: Check batch recall (packId:BATCH -> batchId:RECALLED)
    alt Batch Recalled
        Contract-->>Controller: Throw ChaincodeException (BATCH_RECALLED)
        Controller-->>Client: 500 Error ("Pack belongs to a recalled batch")
    end

    Contract->>State: Read pack current state (packId:CURRENT)
    alt Previous State == SOLD
        Contract-->>Controller: Throw ChaincodeException (ALREADY_SOLD)
        Controller-->>Client: 500 Error ("Pack has already been SOLD. Double-spending detected.")
    end

    Contract->>State: Write packId:EVENT = JSON
    Contract->>State: Write packId:CURRENT = JSON
    Contract-->>Controller: Return serialized Transition object
    Controller-->>Client: 200 OK (Transition JSON)
```

#### Request Payload
```json
POST /api/transition
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "packId": "PACK-9921-X8",
  "eventType": "MINTED",
  "fromId": "GENESIS",
  "toId": "MFR_CIPLA_01",
  "sellingDate": "20260825",
  "sellingTime": "14:30:00",
  "sellerId": "PLANT_A_SUPERVISOR"
}
```

#### Success Response (`200 OK`)
```json
{
  "packId": "PACK-9921-X8",
  "eventType": "MINTED",
  "hash": "PACK-9921-X8:MINTED",
  "fromId": "GENESIS",
  "toId": "MFR_CIPLA_01",
  "sellingDate": "20260825",
  "sellingTime": "14:30:00",
  "sellerId": "PLANT_A_SUPERVISOR"
}
```

---

### 7.2 Record Batch Transitions (`POST /api/transition/batch`)

Writes multiple unit transitions atomically in a single block with built-in idempotency.

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as TransitionController
    participant Contract as PharmaContract
    participant State as Ledger & CouchDB

    Client->>Controller: POST /api/transition/batch { batchId, transitions: [...] }
    Controller->>Contract: submitTransaction("recordTransitionBatch", batchId, transitionsJson)
    
    loop For each item in transitions
        Contract->>State: Write packId:BATCH -> batchId
        Contract->>State: Check if packId:EVENT already exists
        alt Already exists
            Contract->>Contract: Mark as recorded (Idempotent skip)
        else New Transition
            Contract->>State: Write packId:EVENT & packId:CURRENT
            Contract->>Contract: Add to recorded list
        end
    end

    Contract-->>Controller: Return JSON summary { status, totalProcessed, committedCount, failedCount, recordedHashes }
    Controller-->>Client: 200 OK (Batch Summary JSON)
```

#### Request Payload
```json
POST /api/transition/batch
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "batchId": "BATCH-AUG-2026-001",
  "transitions": [
    {
      "packId": "PACK-001",
      "eventType": "MINTED",
      "fromId": "GENESIS",
      "toId": "MFR_01",
      "sellingDate": "20260825",
      "sellingTime": "10:00:00",
      "sellerId": "MFR_LINE_1"
    },
    {
      "packId": "PACK-002",
      "eventType": "MINTED",
      "fromId": "GENESIS",
      "toId": "MFR_01",
      "sellingDate": "20260825",
      "sellingTime": "10:00:00",
      "sellerId": "MFR_LINE_1"
    }
  ]
}
```

#### Success Response (`200 OK`)
```json
{
  "status": "success",
  "totalProcessed": 2,
  "committedCount": 2,
  "failedCount": 0,
  "recordedHashes": [
    "PACK-001",
    "PACK-002"
  ]
}
```

---

### 7.3 Recall Medicine Batch (`POST /api/transition/recall`)

Instantly invalidates an entire batch across the entire supply chain.

```mermaid
sequenceDiagram
    autonumber
    participant Client as Manufacturer / Drug Regulator
    participant Controller as TransitionController
    participant Contract as PharmaContract
    participant State as Ledger & CouchDB

    Client->>Controller: POST /api/transition/recall { systemBatchId, actorId, reason, recallDate, recallTime }
    Controller->>Contract: submitTransaction("recallBatch", systemBatchId, actorId, reason, date, time)
    Contract->>State: Write systemBatchId:RECALLED = RecallTransition JSON
    Contract->>State: Write systemBatchId:RECALL = RecallTransition JSON
    Contract-->>Controller: Return Recall JSON
    Controller-->>Client: 200 OK (Recall Confirmation)
```

#### Request Payload
```json
POST /api/transition/recall
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "systemBatchId": "BATCH-AUG-2026-001",
  "actorId": "REGULATOR_FDA_IN",
  "reason": "Critical temperature excursion during transit (>25C)",
  "recallDate": "20260825",
  "recallTime": "15:45:00"
}
```

#### Success Response (`200 OK`)
```json
{
  "packId": "BATCH-AUG-2026-001",
  "eventType": "RECALLED",
  "hash": "BATCH-AUG-2026-001:RECALLED",
  "fromId": "REGULATOR_FDA_IN",
  "toId": "RECALLED",
  "sellingDate": "20260825",
  "sellingTime": "15:45:00",
  "sellerId": "Critical temperature excursion during transit (>25C)"
}
```

---

### 7.4 Evaluate Pack Status with Recall Priority (`GET /api/transition/status`)

Consumer / Pharmacist verification endpoint. Queries state without submitting an on-chain transaction.

```mermaid
sequenceDiagram
    autonumber
    participant Scanner as Mobile App / Barcode Scanner
    participant Controller as TransitionController
    participant Contract as PharmaContract
    participant State as Ledger (World State)

    Scanner->>Controller: GET /api/transition/status?packHash=PACK-001&batchId=BATCH-AUG-2026-001
    Controller->>Contract: evaluateTransaction("getPackStatus", packHash, batchId)

    Note over Contract,State: Step 1: Check Batch Recall
    Contract->>State: Read batchId:RECALLED
    alt Batch is Recalled
        Contract-->>Controller: Return {"status": "Recalled", "detail": {...}}
        Controller-->>Scanner: 200 OK (Recalled Status)
    else Batch Not Recalled
        Note over Contract,State: Step 2: Check Pack State
        Contract->>State: Read packHash:CURRENT
        alt Pack Found
            Contract-->>Controller: Return {"status": "AtShop" | "Sold" | "Recalled", "detail": {...}}
            Controller-->>Scanner: 200 OK (Verified Status)
        else Pack Not Found
            Contract-->>Controller: Return {"status": "NOT_FOUND"}
            Controller-->>Scanner: 200 OK (NOT_FOUND)
        end
    end
```

#### Request
```http
GET /api/transition/status?packHash=PACK-001&batchId=BATCH-AUG-2026-001
Authorization: Bearer <JWT>
```

#### Response Scenarios

* **Active Valid Pack in Shop:**
```json
{
  "status": "AtShop",
  "detail": {
    "packId": "PACK-001",
    "eventType": "AT_SHOP",
    "hash": "PACK-001:AT_SHOP",
    "fromId": "DISTRIBUTOR_A",
    "toId": "APOLLO_PHARMACY_08",
    "sellingDate": "20260825",
    "sellingTime": "11:20:00",
    "sellerId": "LOGISTICS_DRIVER_4"
  }
}
```

* **Recalled Batch:**
```json
{
  "status": "Recalled",
  "detail": {
    "packId": "BATCH-AUG-2026-001",
    "eventType": "RECALLED",
    "hash": "BATCH-AUG-2026-001:RECALLED",
    "fromId": "REGULATOR_FDA_IN",
    "toId": "RECALLED",
    "sellingDate": "20260825",
    "sellingTime": "15:45:00",
    "sellerId": "Critical temperature excursion during transit (>25C)"
  }
}
```

* **Unregistered Counterfeit Pack:**
```json
{
  "status": "NOT_FOUND"
}
```

---

### 7.5 Get Current Pack State (`GET /api/transition/pack/{hash}/current`)

Retrieves the current pointer state object of a medicine pack.

```http
GET /api/transition/pack/PACK-9921-X8/current
Authorization: Bearer <JWT>
```

#### Success Response (`200 OK`)
```json
{
  "packId": "PACK-9921-X8",
  "eventType": "AT_SHOP",
  "hash": "PACK-9921-X8:AT_SHOP",
  "fromId": "DISTRIBUTOR_DELHI",
  "toId": "MEDPLUS_STORE_101",
  "sellingDate": "20260825",
  "sellingTime": "12:00:00",
  "sellerId": "DELIVERY_AGENT_01"
}
```

---

### 7.6 Get Immutable Pack History (`GET /api/transition/pack/{hash}/history`)

Retrieves the complete, tamper-proof chronological audit trail directly from the blockchain block history (`ctx.getStub().getHistoryForKey()`).

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as TransitionController
    participant Contract as PharmaContract
    participant Ledger as Blockchain History Iterator

    Client->>Controller: GET /api/transition/pack/{hash}/history
    Controller->>Contract: evaluateTransaction("getPackHistory", hash)
    Contract->>Ledger: getHistoryForKey(hash + ":CURRENT")
    Ledger-->>Contract: Stream of KeyModifications [Block 3, Block 5, Block 8]
    Contract->>Contract: Filter deleted keys & serialize list
    Contract-->>Controller: Return JSON array of historical transitions
    Controller-->>Client: 200 OK (Full History Array)
```

#### Request
```http
GET /api/transition/pack/PACK-9921-X8/history
Authorization: Bearer <JWT>
```

#### Success Response (`200 OK`)
```json
[
  {
    "packId": "PACK-9921-X8",
    "eventType": "MINTED",
    "hash": "PACK-9921-X8:MINTED",
    "fromId": "GENESIS",
    "toId": "MFR_CIPLA_01",
    "sellingDate": "20260825",
    "sellingTime": "09:00:00",
    "sellerId": "PLANT_MGR"
  },
  {
    "packId": "PACK-9921-X8",
    "eventType": "INTAKE",
    "hash": "PACK-9921-X8:INTAKE",
    "fromId": "MFR_CIPLA_01",
    "toId": "DISTRIBUTOR_DELHI",
    "sellingDate": "20260825",
    "sellingTime": "11:00:00",
    "sellerId": "LOGISTICS_SUPV"
  },
  {
    "packId": "PACK-9921-X8",
    "eventType": "AT_SHOP",
    "hash": "PACK-9921-X8:AT_SHOP",
    "fromId": "DISTRIBUTOR_DELHI",
    "toId": "MEDPLUS_STORE_101",
    "sellingDate": "20260825",
    "sellingTime": "12:00:00",
    "sellerId": "DELIVERY_AGENT_01"
  }
]
```

---

### 7.7 Query Specific Transition by Hash (`GET /api/transition/{hash}`)

Fetches a specific point-in-time state event by its composite key (e.g. `PACK-9921-X8:MINTED`).

```http
GET /api/transition/PACK-9921-X8:MINTED
Authorization: Bearer <JWT>
```

#### Success Response (`200 OK`)
```json
{
  "packId": "PACK-9921-X8",
  "eventType": "MINTED",
  "hash": "PACK-9921-X8:MINTED",
  "fromId": "GENESIS",
  "toId": "MFR_CIPLA_01",
  "sellingDate": "20260825",
  "sellingTime": "09:00:00",
  "sellerId": "PLANT_MGR"
}
```

---

### 7.8 Rich CouchDB Selector Query (`GET /api/transition`)

Executes JSON mango queries against the CouchDB state database filtered by `fromId`, `toId`, or composite `hash`.

```http
GET /api/transition?fromId=DISTRIBUTOR_DELHI&toId=MEDPLUS_STORE_101
Authorization: Bearer <JWT>
```

#### Success Response (`200 OK`)
```json
[
  {
    "packId": "PACK-9921-X8",
    "eventType": "AT_SHOP",
    "hash": "PACK-9921-X8:AT_SHOP",
    "fromId": "DISTRIBUTOR_DELHI",
    "toId": "MEDPLUS_STORE_101",
    "sellingDate": "20260825",
    "sellingTime": "12:00:00",
    "sellerId": "DELIVERY_AGENT_01"
  }
]
```

---

### 7.9 Actuator Health Check (`GET /actuator/health`)

Public health endpoint used by container orchestrators and readiness checks. Does not require JWT auth.

```http
GET /actuator/health
```

#### Response (`200 OK`)
```json
{
  "status": "UP"
}
```

---

## 8. Storage & Ledger Key Schema

The Hyperledger Fabric World State (stored in CouchDB) uses strict, deterministic key patterns:

| Key Pattern | Sample Key | Purpose | Value Stored |
| :--- | :--- | :--- | :--- |
| `{packId}:{eventType}` | `PACK-001:MINTED` | Immutable snapshot of a specific lifecycle event | Transition JSON |
| `{packId}:CURRENT` | `PACK-001:CURRENT` | Pointer to the active custody state of the pack | Transition JSON |
| `{packId}:BATCH` | `PACK-001:BATCH` | Maps a medicine pack to its parent manufacturing batch ID | String (e.g. `BATCH-001`) |
| `{batchId}:RECALLED` | `BATCH-001:RECALLED` | Flag indicating an emergency recall on the batch | Recall Transition JSON |
| `{batchId}:RECALL` | `BATCH-001:RECALL` | Secondary lookup key for recall status | Recall Transition JSON |

---

## 9. Operational Cheat Sheet (Docker Commands)

### 1. Start the Complete Stack
```powershell
docker compose up --build -d
```

### 2. Stream Real-Time Logs
```powershell
# Channel & Chaincode Deployment Job
docker compose logs -f fabric-setup-channel

# Spring Boot REST Gateway
docker compose logs -f pharma-backend

# Fabric Peer Node
docker compose logs -f peer0.org1.example.com
```

### 3. Complete Network Reset (Wipe Ledgers & Restart Fresh)
```powershell
docker compose down -v
docker compose up --build -d
```

### 4. Verify API Health
```powershell
curl http://localhost:8080/actuator/health
```
