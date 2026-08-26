#!/bin/bash
# =============================================================================
# deploy-channel.sh
# Joins orderer and peer, packages and deploys pharmacc chaincode.
# Expects the chaincode shadowJar to already be built at:
#   /chaincode/build/libs/pharmacc.jar
# Runs inside fabric-setup-channel container ONCE.
# =============================================================================
set -e

echo "======================================================"
echo "  PharmaChain: Channel & Chaincode Deployment"
echo "======================================================"

DELAY=3
MAX_RETRY=10
CHANNEL_NAME=mychannel
CC_NAME=pharmacc
CC_VERSION=1.0
CC_SEQUENCE=1
ORDERER_CA=/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
ORDERER_ADMIN_SIGN_CERT=/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
ORDERER_ADMIN_PRIV_KEY=/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key
GENESIS_BLOCK=/organizations/channel-artifacts/${CHANNEL_NAME}.block
JAR_FILE=/chaincode/build/libs/pharmacc.jar
PACKAGE_STAGING=/tmp/chaincode-pkg

# Wait for peer to be reachable
echo "⏳ Waiting for peer0.org1.example.com to be ready..."
for i in $(seq 1 $MAX_RETRY); do
    peer node status >/dev/null 2>&1 && break || true
    if [ $i -eq $MAX_RETRY ]; then
        echo "❌ Peer not ready after $MAX_RETRY attempts. Exiting."
        exit 1
    fi
    echo "  Attempt $i/$MAX_RETRY — retrying in ${DELAY}s..."
    sleep $DELAY
done
echo "✅ Peer is up!"

# ── 1. Join Peer to Channel ───────────────────────────────────────────────────
echo ""
echo "📣 Step 1: Joining Peer to channel '$CHANNEL_NAME'..."

# Fetch the orderer's processed genesis block (not the raw file).
# The orderer adds etcdraft metadata during initialization, changing the block
# hash. If we join the peer with the raw file, block hashes won't match.
FETCHED_BLOCK=/tmp/${CHANNEL_NAME}-fetched.block
peer channel fetch 0 "$FETCHED_BLOCK" \
    -o orderer.example.com:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --channelID "$CHANNEL_NAME" \
    --tls \
    --cafile "$ORDERER_CA" || {
    echo "⚠️  Could not fetch block 0 — falling back to genesis file"
    FETCHED_BLOCK="$GENESIS_BLOCK"
}

peer channel join -b "$FETCHED_BLOCK" || \
    echo "⚠️  Peer may already be joined to channel — continuing..."

echo "✅ Channel joined!"

# ── 2. Build Chaincode Package Manually from pre-built JAR ───────────────────
# The correct way for Java chaincode is:
#   metadata.json + code.tar.gz (containing connection.json + chaincode.jar)
# packed together into a final .tar.gz package
echo ""
echo "📦 Step 2: Packaging chaincode from pre-built JAR..."

if [ ! -f "$JAR_FILE" ]; then
    echo "❌ ERROR: Shadow JAR not found at $JAR_FILE"
    echo "   Ensure fabric-build-chaincode service ran successfully."
    exit 1
fi
echo "✅ Found JAR at $JAR_FILE"

# Clean staging directory
rm -rf "$PACKAGE_STAGING"
mkdir -p "$PACKAGE_STAGING/code"

# Write metadata.json
cat > "$PACKAGE_STAGING/metadata.json" << EOF
{"type":"java","label":"${CC_NAME}_${CC_VERSION}"}
EOF

# Write connection.json (not used for embedded jar, but required structure)
# For Java chaincode packaged as a jar, we put the jar directly in code/
cp "$JAR_FILE" "$PACKAGE_STAGING/code/chaincode.jar"

# Create code.tar.gz from code/ directory
cd "$PACKAGE_STAGING"
tar -czf code.tar.gz -C code .

# Create final package .tar.gz
tar -czf /tmp/${CC_NAME}.tar.gz metadata.json code.tar.gz
cd -

echo "✅ Chaincode packaged!"

# ── 3. Install Chaincode ──────────────────────────────────────────────────────
echo ""
echo "📥 Step 3: Installing chaincode on peer..."

peer lifecycle chaincode install /tmp/${CC_NAME}.tar.gz || true
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled \
    | grep "Package ID:" \
    | grep "${CC_NAME}_${CC_VERSION}" \
    | awk '{print $3}' \
    | tr -d ',' \
    | tail -n 1)

if [ -z "$PACKAGE_ID" ]; then
    echo "❌ ERROR: Could not determine Package ID after install."
    peer lifecycle chaincode queryinstalled
    exit 1
fi

echo "  Package ID: $PACKAGE_ID"

# Wait for peer deliver service to be ready after install
echo "⏳ Waiting 10s for peer deliver service to warm up..."
sleep 10

# ── 4 & 5. Check If Already Committed / Approve & Commit ─────────────────────
if peer lifecycle chaincode querycommitted --channelID "$CHANNEL_NAME" --name "$CC_NAME" --tls --cafile "$ORDERER_CA" 2>/dev/null | grep -qi "Version: ${CC_VERSION}"; then
    echo "⚠️  Chaincode '${CC_NAME}' version '${CC_VERSION}' is already committed on channel '${CHANNEL_NAME}'."
    echo "   Skipping approval and commit."
else
    # ── 4. Approve Chaincode ──────────────────────────────────────────────────
    echo ""
    echo "✍️  Step 4: Approving chaincode for org..."

    peer lifecycle chaincode approveformyorg \
        -o orderer.example.com:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --channelID "$CHANNEL_NAME" \
        --name "$CC_NAME" \
        --version "$CC_VERSION" \
        --package-id "$PACKAGE_ID" \
        --sequence "$CC_SEQUENCE" \
        --tls \
        --cafile "$ORDERER_CA" \
        --waitForEvent=false

    echo "✅ Chaincode approve submitted!"
    echo "⏳ Waiting 5s then verifying approval..."
    sleep 5

    peer lifecycle chaincode checkcommitreadiness \
        --channelID "$CHANNEL_NAME" \
        --name "$CC_NAME" \
        --version "$CC_VERSION" \
        --sequence "$CC_SEQUENCE" \
        --tls \
        --cafile "$ORDERER_CA" \
        --output json

    # ── 5. Commit Chaincode ───────────────────────────────────────────────────
    echo ""
    echo "✅ Step 5: Committing chaincode to channel..."

    peer lifecycle chaincode commit \
        -o orderer.example.com:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --channelID "$CHANNEL_NAME" \
        --name "$CC_NAME" \
        --version "$CC_VERSION" \
        --sequence "$CC_SEQUENCE" \
        --tls \
        --cafile "$ORDERER_CA" \
        --peerAddresses peer0.org1.example.com:7051 \
        --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
        --waitForEvent=false

    echo "⏳ Waiting 15s then verifying commit..."
    sleep 15
fi

peer lifecycle chaincode querycommitted \
    --channelID "$CHANNEL_NAME" \
    --name "$CC_NAME" \
    --tls \
    --cafile "$ORDERER_CA"

echo ""
echo "🎉 =============================================="
echo "   pharmacc chaincode committed on '$CHANNEL_NAME'"
echo "   pharma-backend will start momentarily."
echo "==============================================="
