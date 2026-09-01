#!/usr/bin/env bash
# scripts/start-mobile.sh — Launches Expo Metro Bundlers for both mobile apps

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "📱 [PharmaChain Mobile] Starting Mobile App Bundlers in Background..."

# 1. Start Shopkeeper Mobile App (Port 8081)
if [ -d "$PROJECT_ROOT/frontend/shopkeeper-mobile" ]; then
  cd "$PROJECT_ROOT/frontend/shopkeeper-mobile"
  if [ ! -d "node_modules" ]; then
    echo "📦 [Shopkeeper Mobile] Installing dependencies..."
    npm install --legacy-peer-deps > "$PROJECT_ROOT/.shopkeeper-mobile.log" 2>&1
  fi
  # Kill any existing process on port 8081
  lsof -ti:8081 | xargs kill -9 2>/dev/null || true
  EXPO_OFFLINE=1 npx expo start --offline --host lan --port 8081 >> "$PROJECT_ROOT/.shopkeeper-mobile.log" 2>&1 &
  SHOP_PID=$!
  echo "✅ Shopkeeper Mobile App started (PID: $SHOP_PID, Port: 8081)"
fi

# 2. Start Customer Mobile App (Port 8082)
if [ -d "$PROJECT_ROOT/frontend/customer-mobile" ]; then
  cd "$PROJECT_ROOT/frontend/customer-mobile"
  if [ ! -d "node_modules" ]; then
    echo "📦 [Customer Mobile] Installing dependencies..."
    npm install --legacy-peer-deps > "$PROJECT_ROOT/.customer-mobile.log" 2>&1
  fi
  # Kill any existing process on port 8082
  lsof -ti:8082 | xargs kill -9 2>/dev/null || true
  EXPO_OFFLINE=1 npx expo start --offline --host lan --port 8082 >> "$PROJECT_ROOT/.customer-mobile.log" 2>&1 &
  CUST_PID=$!
  echo "✅ Customer Mobile App started (PID: $CUST_PID, Port: 8082)"
fi

echo "📲 Mobile Bundler Logs: tail -f .shopkeeper-mobile.log | tail -f .customer-mobile.log"
