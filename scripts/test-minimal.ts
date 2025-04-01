// Minimal test to check if tevm import works
console.log("Starting minimal test...");

import { createTevmNode } from "tevm";

console.log("TEVM imported successfully");

const node = createTevmNode({
  fork: undefined, // No forking
  miningConfig: {
    type: "auto"
  }
});

console.log("TEVM node created");

await node.ready();

console.log("TEVM node ready");

// Simple test - get chain ID
const chainId = await node.provider.request({
  method: "eth_chainId",
  params: [],
});

console.log("Chain ID:", parseInt(chainId as string, 16)); 