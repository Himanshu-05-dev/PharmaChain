#!/bin/bash
# =============================================================================
# generate-crypto.sh
# Generates all cryptographic material for Org1 and Orderer using cryptogen.
# Also generates the channel genesis block using configtxgen.
# Runs inside the fabric-setup-crypto container ONCE.
# =============================================================================
set -e

echo "======================================================"
echo "  PharmaChain: Generating Crypto Materials"
echo "======================================================"

CONFIG_DIR=/config
ORGS_DIR=/organizations

# Check if the target certificates actually exist
if [ -f "$ORGS_DIR/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt" ] && \
   [ -f "$ORGS_DIR/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt" ]; then
    echo "âœ… Target crypto certificates already exist. Skipping generation."
else
    echo "âš ï¸ Target crypto certificates missing or incomplete. Cleaning up stale directories..."
    rm -rf "$ORGS_DIR/ordererOrganizations" "$ORGS_DIR/peerOrganizations" "$ORGS_DIR/channel-artifacts"
    
    echo "ðŸ“ Generating crypto config using cryptogen..."
    cryptogen generate \
        --config="$CONFIG_DIR/crypto-config.yaml" \
        --output="$ORGS_DIR"
fi

echo "ðŸ“ Generating channel genesis block using configtxgen..."
mkdir -p "$ORGS_DIR/channel-artifacts"
rm -f "$ORGS_DIR/channel-artifacts/mychannel.block"
configtxgen \
    -profile OneOrgApplicationGenesis \
    -outputBlock "$ORGS_DIR/channel-artifacts/mychannel.block" \
    -channelID mychannel \
    -configPath "$CONFIG_DIR"

echo "âœ… Crypto material and genesis block generated successfully!"
