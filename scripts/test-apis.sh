#!/usr/bin/env bash
set -e

# ==============================================================================
# PharmaChain Complete Live API Test Runner
# Tests all endpoints: Pharma Core, Consumer Mobile, Shopkeeper POS, Manufacturer & Admin
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "🧪 Running PharmaChain Live API Test Suite..."
cd "${ROOT_DIR}/server"
node tests/comprehensive_live_api_test.mjs "$@"
