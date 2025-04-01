#!/bin/bash

# Get RPC URL from .env file
TATARA_RPC_URL=$(grep TATARA_RPC_URL $(pwd)/.env | cut -d '=' -f2)
echo "TATARA_RPC_URL: $TATARA_RPC_URL"

if [ -z "$TATARA_RPC_URL" ]; then
  echo "❌ Error: TATARA_RPC_URL environment variable is not set"
  echo "Please set it in your .env file"
  exit 1
fi

echo "⚡ Starting local Tatara fork with Anvil..."
echo "RPC URL: $TATARA_RPC_URL"

# Start anvil with Tatara fork
anvil \
  --fork-url "$TATARA_RPC_URL" \
  --chain-id 471 \
  --port 8545 \
  --block-time 12

# This will keep running until Ctrl+C is pressed 