# ⛓️ PharmaChain: Blockchain Microservice & REST Gateway
### Part of Smart India Hackathon (SIH 2026) | National Drug Provenance Ledger

This repository contains the **immutable trust backbone** for PharmaChain. It consists of two primary parts running together inside a self-contained, one-click Docker orchestration system:

1. **`pharmacc` (Hyperledger Fabric Chaincode)**: A Java-based smart contract implementing append-only custody logs, dual-key indexing, and strict supply chain custody rule validation.
2. **`pharma-backend` (Spring Boot Gateway)**: A REST gateway running on port `8080` that translates standard REST/HTTP requests from `pharma-core` into secure Netty-shaded gRPC transactions directed at Fabric peers.

---

## 🏗️ System Design & Architecture

```
                    ┌───────────────────────────────┐
                    │  pharma-core-service (:4000)   │
                    └───────────────┬───────────────┘
                                    │
                                    │ HTTP REST + Bearer JWT
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│              DOCKER COMPOSE ORCHESTRATION GATEWAY LAYER (:8080)          │
│                                                                          │
│  ┌───────────────────────┐            ┌───────────────────────────────┐  │
│  │    pharma-backend     ├───────────►│      peer0.org1.example.com   │  │
│  │ (Spring Boot Gateway) │ gRPC mTLS  │  • pharmacc Chaincode         │  │
│  └───────────────────────┘            │  • World State (CouchDB)      │  │
│                                       └───────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start (One-Click Docker Launch)

To spin up the entire blockchain network (CA, orderers, peers, CouchDB state engines), compile and deploy the chaincode, and boot the Spring Boot REST API:

```bash
# 1. Start the entire container stack
docker compose up --build -d

# 2. Check startup logs of channel deployment & backend
docker compose logs -f fabric-setup-channel
docker compose logs -f pharma-backend
```

On first startup, the build takes around 2–3 minutes to download dependencies, compile the Java Chaincode shadow JAR, spin up the ledger, and join the network channel. Subsequent runs take under 10 seconds.

Verify the REST API is healthy:
```bash
curl http://localhost:8080/actuator/health
```

---

## 🔒 Security & OAuth2 Validation

All state modification endpoints (`POST`) require an authentication `Bearer <JWT>` token signed by `pharma-core`'s RSA-4096 key. The public key is resolved dynamically using the JWKS endpoint configured in `.env` (`PHARMA_CORE_JWKS_URL`).

Public lookup endpoints (`GET`) are exposed without authentication to ensure low-latency scan validations.

---

## 📡 API Reference Matrix

All endpoints are hosted on port `8080`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/transition` | Records a single state change (`MINTED`, `INTAKE`, `SOLD`) | Yes |
| `POST` | `/api/transition/batch` | Bulk records multiple transitions (soft idempotent on retry) | Yes |
| `POST` | `/api/transition/recall/{batchId}` | Declares a batch recalled across the supply chain | Yes |
| `GET` | `/api/transition/pack/{hash}/current` | Gets the current status and last event payload for a pack | No |
| `GET` | `/api/transition/pack/{hash}/history` | Chronological lifecycle trail of all transitions | No |
| `GET` | `/api/transition/status?packHash=&batchId=` | Evaluates status mapping including recall rules | No |
