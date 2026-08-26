# ⛓️ Hyperledger Fabric + Spring Boot Gateway Setup Guide
### Standard Developer Operation Manual

PharmaChain's blockchain infrastructure is fully containerized using Docker Compose. Developers do not need to install local Fabric binaries, generate certificates manually, or configure WSL2 routing paths.

---

## 📋 Prerequisites
- **Docker & Docker Compose** (Docker Desktop on Windows/macOS or Docker Engine on Linux)
- **Java 17 Development Kit (JDK 17)** (only if running/testing the backend/chaincode outside docker)
- **Curl** (for API smoke tests)

---

## ⚡ 1. Standard Startup

Run this command at the root of the project to initialize the network:

```bash
docker compose up --build -d
```

### What happens behind the scenes:
1. **`fabric-setup-crypto`**: Generates cryptographic identities (certificates, private keys) for peers and orderers using `cryptogen`, and generates the genesis block using `configtxgen`. Stores files in the `./organizations` volume.
2. **`couchdb0`**: Launches CouchDB to serve as the Peer World State engine.
3. **`peer0.org1.example.com`** & **`orderer.example.com`**: Boot up and mount the certificates generated in step 1.
4. **`fabric-setup-channel`**: Joins the orderer and peer to the network channel (`mychannel`), runs Gradle inside the container to build the Java chaincode `pharmacc.jar`, packages it, installs it on the peer, and approves/commits the contract lifecycle.
5. **`pharma-backend`**: Builds the Spring Boot REST API using a multi-stage Docker build, sets up Gateway SDK connections using mounted keys, and opens port `8080`.

---

## 📡 2. Verification & Testing

### Health check
Check if the REST Gateway is healthy:
```bash
curl http://localhost:8080/actuator/health
```
**Expected Response:**
```json
{"status":"UP"}
```

### Verify chaincode status endpoint (empty state)
```bash
curl "http://localhost:8080/api/transition/status?packHash=abc&batchId=batch001"
```
**Expected Response:**
```json
{"status":"NOT_FOUND"}
```

---

## 🛠️ 3. Troubleshooting

### View Logs
To trace deployment progress, view the logs for the installer container:
```bash
docker compose logs -f fabric-setup-channel
```

To see the REST Gateway console output:
```bash
docker compose logs -f pharma-backend
```

### Clean State Reset
If you make changes to the chaincode model or want to reset all databases and start with a clean ledger:
```bash
docker compose down -v
docker compose up --build -d
```
The `-v` flag deletes all persistent Docker volumes (CouchDB records, ledger blocks, and generated certificates).

---

## 📁 Environment Configuration

The REST gateway uses environment variables inside `.env` to locate keys.

| Variable | Description | Default in docker-compose |
|---|---|---|
| `PHARMA_CORE_JWKS_URL` | JWKS endpoint of `pharma-core` | `http://pharma-core:4000/.well-known/jwks.json` |
| `SERVER_PORT` | REST Gateway exposed port | `8080` |
| `FABRIC_CERT_PATH` | User certificate path | `/crypto/users/User1@org1.example.com/msp/signcerts/cert.pem` |
| `FABRIC_KEY_DIR` | User private key keystore directory | `/crypto/users/User1@org1.example.com/msp/keystore` |
| `FABRIC_TLS_CERT_PATH` | Peer TLS CA cert path | `/crypto/peers/peer0.org1.example.com/tls/ca.crt` |
| `PEER_ENDPOINT` | Peer gRPC endpoint | `peer0.org1.example.com:7051` |
