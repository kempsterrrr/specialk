#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

const TATARA_CHAIN_ID = 471;
const KATANA_MAINNET_CHAIN_ID = 0; // Will be updated when mainnet launches

const TATARA_ADDRESSES_PATH = 'interfaces/utils/TataraAddresses.sol';
const KATANA_ADDRESSES_PATH = 'interfaces/utils/KatanaAddresses.sol';
const OUTPUT_PATH = 'utils/addresses.ts';

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
  
  // Create the TypeScript file content with proper type definitions
  const tsContent = `// Auto-generated contract address mapping
// Generated on ${new Date().toISOString()}

/**
 * Chain IDs for Tatara testnet and Katana mainnet
 */
export interface ChainIds {
  TATARA: number;
  KATANA: number;
}

/**
 * Contract addresses for each network - using viem's Address type format
 */
export interface ContractAddresses {
  [contractName: string]: {
    tatara: \`0x\${string}\` | null;
    katana: \`0x\${string}\` | null;
  };
}

/**
 * Chain ID constants
 */
export const CHAIN_IDS: ChainIds = {
  TATARA: ${TATARA_CHAIN_ID},
  KATANA: ${KATANA_MAINNET_CHAIN_ID}
};

/**
 * Mapping of contract names to their addresses on each network
 */
export const CONTRACT_ADDRESSES: ContractAddresses = {
${Object.entries(addressMapping)
  .map(([name, addrs]) => {
    // Correctly type addresses as template literal types
    const tatara = addrs.tatara ? `"tatara": "${addrs.tatara}" as \`0x\${string}\`` : '"tatara": null';
    const katana = addrs.katana ? `"katana": "${addrs.katana}" as \`0x\${string}\`` : '"katana": null';
    return `  "${name}": { ${tatara}, ${katana} }`;
  })
  .join(',\n')}
};

/**
 * Get a contract address based on the contract name and chain ID
 * @param contractName - The name of the contract (without "get" and "Address")
 * @param chainId - The chain ID
 * @returns The contract address or null if not found
 */
export function getContractAddress(contractName: string, chainId: number): \`0x\${string}\` | null {
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
  fs.writeFileSync(OUTPUT_PATH, tsContent);
  console.log(`Address mapping generated at ${OUTPUT_PATH}`);
}

// Execute the script
generateAddressMapping(); 