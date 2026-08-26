# PharmaChain Running Guide

This guide is for running the blockchain stack and REST gateway locally with Docker Compose.
It is written for first-time setup on a new system.

## 1. What This Project Starts

Running this repository starts:

1. Hyperledger Fabric CA services
2. Orderer and peer
3. CouchDB world state
4. One-time crypto and channel setup jobs
5. Java chaincode build/deploy job
6. Spring Boot REST gateway on port 8080

## 2. Prerequisites

Install the following before running:

1. Docker Engine or Docker Desktop
2. Docker Compose v2 (`docker compose` command)
3. Minimum 6 GB free RAM available to Docker
4. `curl` for API verification

Optional (only if running Gradle outside Docker):

1. JDK 17

Quick checks:

```bash
docker --version
docker compose version
curl --version
```

## 3. Clone and Environment Setup

From project root:

```bash
cd /path/to/pharma-blockchain-project
cp .env.example .env
```

You can keep defaults for local run. Important variables in `.env`:

1. `PHARMA_CORE_JWKS_URL` (JWT key set URL for write auth)
2. `SERVER_PORT` (default `8080`)

## 4. Start Everything (One Command)

```bash
docker compose up --build -d
```

Expected startup order:

1. `fabric-setup-crypto` generates crypto + channel block
2. `couchdb0`, `orderer.example.com`, `peer0.org1.example.com` start
3. `fabric-build-chaincode` builds `pharmacc.jar`
4. `fabric-setup-channel` joins channel and commits chaincode
5. `pharma-backend` starts after setup job completes

First run may take 2 to 5 minutes.

## 5. Watch Progress

Use these logs in separate terminals:

```bash
docker compose logs -f fabric-setup-crypto
docker compose logs -f fabric-build-chaincode
docker compose logs -f fabric-setup-channel
docker compose logs -f pharma-backend
```

When healthy, backend logs should show Spring Boot startup completion and no Fabric gateway connection errors.

## 6. Verify It Is Working

### 6.1 Health endpoint

```bash
curl http://localhost:8080/actuator/health
```

Expected:

```json
{"status":"UP"}
```

### 6.2 Ledger status lookup (Auth Required)

```bash
curl "http://localhost:8080/api/transition/status?packHash=test-pack&batchId=test-batch" \
    -H "Authorization: Bearer $TOKEN"
```

Expected for unknown pack:

```json
{"status":"NOT_FOUND"}
```

### 6.3 Ledger read APIs (Auth Required)

```bash
curl http://localhost:8080/api/transition/pack/test-pack/current \
    -H "Authorization: Bearer $TOKEN"
curl http://localhost:8080/api/transition/pack/test-pack/history \
    -H "Authorization: Bearer $TOKEN"
```

These may return not-found errors until valid transitions are written.

## 7. Write API Usage (Auth Required)

All `POST /api/transition...` endpoints require a Bearer JWT.

Set token once:

```bash
export TOKEN="<valid-jwt-from-pharma-core>"
```

### 7.1 Record one transition

```bash
curl -X POST http://localhost:8080/api/transition \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{
		"packId": "PACK001",
		"eventType": "MINTED",
		"fromId": "GENESIS",
		"toId": "MFR001",
		"sellingDate": "20260822",
		"sellingTime": "10:30:00",
		"sellerId": "LINE01"
	}'
```

### 7.2 Batch transition write

```bash
curl -X POST http://localhost:8080/api/transition/batch \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{
		"batchId": "BATCH001",
		"transitions": [
			{
				"packId": "PACK002",
				"eventType": "MINTED",
				"fromId": "GENESIS",
				"toId": "MFR001",
				"sellingDate": "20260822",
				"sellingTime": "11:00:00",
				"sellerId": "LINE01"
			}
		]
	}'
```

### 7.3 Recall a batch

```bash
curl -X POST http://localhost:8080/api/transition/recall \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "systemBatchId": "BATCH001",
        "actorId": "MFR001",
        "reason": "temperature excursion",
        "recallDate": "20260822",
        "recallTime": "12:15:00"
    }'
```

## 8. Stop, Restart, Reset

Stop services (keep data):

```bash
docker compose down
```

Hard reset (remove volumes and regenerate network data):

```bash
docker compose down -v
docker compose up --build -d
```

## 9. Common Problems and Fixes

### Problem: backend is up but write APIs return 401

Cause: missing/invalid JWT.

Fix:

1. Verify `Authorization: Bearer <token>` is present
2. Ensure token is signed by JWKS referenced in `PHARMA_CORE_JWKS_URL`

### Problem: channel setup job fails

Check:

```bash
docker compose logs fabric-setup-channel
docker compose logs fabric-build-chaincode
```

Then run a clean reset:

```bash
docker compose down -v
docker compose up --build -d
```

### Problem: Gradle permission errors in local (non-Docker) runs

If old root-owned artifacts exist from earlier runs:

```bash
sudo chown -R "$USER":"$USER" backend/.gradle backend/build chaincode/.gradle chaincode/build
```

Use this only when you explicitly run Gradle on host.

## 10. Minimal Success Checklist

Project is successfully running when all are true:

1. `docker compose ps` shows `pharma-backend`, peer, orderer, couchdb running
2. `fabric-setup-channel` completed successfully
3. `curl http://localhost:8080/actuator/health` returns `{"status":"UP"}`
4. `GET /api/transition/status` returns JSON response
