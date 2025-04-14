#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

const TATARA_CHAIN_ID = 471;
const KATANA_MAINNET_CHAIN_ID = 0; // Will be updated when mainnet launches

const TATARA_ADDRESSES_PATH = 'interfaces/utils/TataraAddresses.sol';
const KATANA_ADDRESSES_PATH = 'interfaces/utils/KatanaAddresses.sol';
const OUTPUT_PATH = 'utils/addresses.js';

/**
 * Extract function names and addresses from TataraAddresses.sol
 * @returns {Object} Map of contract names to addresses
 */
function extractTataraAddresses() {
  const content = fs.readFileSync(TATARA_ADDRESSES_PATH, 'utf8');
  const addresses = {};
  
  // Regular expression to match functions like getXXXAddress() and their return values
  const functionRegex = /function\s+get(\w+)Address\(\)\s+internal\s+pure\s+returns\s+\(address\)\s+{\s+return\s+(0x[a-fA-F0-9]+);/g;
  
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const contractName = match[1];
    const address = match[2];
    addresses[contractName] = address;
  }
  
  return addresses;
}

/**
 * Extract Katana mainnet addresses from KatanaAddresses.sol
 * @returns {Object} Map of contract names to addresses
 */
function extractKatanaAddresses() {
  const content = fs.readFileSync(KATANA_ADDRESSES_PATH, 'utf8');
  const addresses = {};
  
  // Extract function names first
  const functionNameRegex = /function\s+get(\w+)Address\(\)\s+internal/g;
  const contractNames = [];
  
  let nameMatch;
  while ((nameMatch = functionNameRegex.exec(content)) !== null) {
    contractNames.push(nameMatch[1]);
  }
  
  // For each contract name, try to find the mainnet address if it exists
  for (const contractName of contractNames) {
    // Look for the mainnet address pattern in the corresponding function
    const mainnetAddressRegex = new RegExp(`function\\s+get${contractName}Address.*?if\\s+\\(isMainnet\\(\\)\\)\\s+{[^}]*?return\\s+(0x[a-fA-F0-9]+|address\\(0\\));`, 's');
    const mainnetMatch = content.match(mainnetAddressRegex);
    
    if (mainnetMatch) {
      const addressValue = mainnetMatch[1];
      // Only add non-zero addresses
      if (addressValue !== 'address(0)') {
        addresses[contractName] = addressValue;
      }
    }
  }
  
  return addresses;
}

/**
 * Generate the address mapping
 */
function generateAddressMapping() {
  const tataraAddresses = extractTataraAddresses();
  const katanaAddresses = extractKatanaAddresses();
  
  // Combine all unique contract names
  const allContractNames = new Set([
    ...Object.keys(tataraAddresses),
    ...Object.keys(katanaAddresses)
  ]);
  
  // Create the mapping object
  const addressMapping = {};
  
  allContractNames.forEach(contractName => {
    addressMapping[contractName] = {
      tatara: tataraAddresses[contractName] || null,
      katana: katanaAddresses[contractName] || null
    };
  });
  
  // Create the JavaScript file content
  const jsContent = `// Auto-generated contract address mapping
// Generated on ${new Date().toISOString()}

export const CHAIN_IDS = {
  TATARA: ${TATARA_CHAIN_ID},
  KATANA: ${KATANA_MAINNET_CHAIN_ID}
};

export const CONTRACT_ADDRESSES = ${JSON.stringify(addressMapping, null, 2)};

/**
 * Get a contract address based on the contract name and chain ID
 * @param {string} contractName - The name of the contract (without "get" and "Address")
 * @param {number} chainId - The chain ID
 * @returns {string|null} The contract address or null if not found
 */
export function getContractAddress(contractName, chainId) {
  if (!contractName || !CONTRACT_ADDRESSES[contractName]) {
    return null;
  }
  
  switch (chainId) {
    case CHAIN_IDS.TATARA:
      return CONTRACT_ADDRESSES[contractName].tatara;
    case CHAIN_IDS.KATANA:
      return CONTRACT_ADDRESSES[contractName].katana;
    default:
      return null;
  }
}

export default getContractAddress;
`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the output file
  fs.writeFileSync(OUTPUT_PATH, jsContent);
  console.log(`Address mapping generated at ${OUTPUT_PATH}`);
}

// Execute the script
generateAddressMapping(); 