#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { execSync } from 'node:child_process';

// Constants
const INTERFACES_DIR = join(process.cwd(), 'interfaces');
const ABIS_DIR = join(process.cwd(), 'abis');
const ADDRESS_FILE = join(INTERFACES_DIR, 'utils', 'KatanaAddresses.sol');
const OUTPUT_DIR = join(process.cwd(), 'dist');
const FULL_OUTPUT = join(OUTPUT_DIR, 'contractdir.json');
const SAMPLE_OUTPUT = join(OUTPUT_DIR, 'contractdir_sample.json');
const SAMPLE_SIZE = 10; // Number of contracts to include in the sample

// Check that required directories exist
if (!existsSync(INTERFACES_DIR)) {
  console.error('Error: Interfaces directory does not exist');
  process.exit(1);
}

if (!existsSync(ABIS_DIR)) {
  console.error('Error: ABIs directory does not exist. Run "bun run build:abi" first.');
  process.exit(1);
}

if (!existsSync(ADDRESS_FILE)) {
  console.error('Error: KatanaAddresses.sol file does not exist');
  process.exit(1);
}

if (!existsSync(OUTPUT_DIR)) {
  execSync(`mkdir -p ${OUTPUT_DIR}`);
}

console.log('Generating contract directory files...');

// Extract addresses from KatanaAddresses.sol
function extractAddresses() {
  try {
    const addressContent = readFileSync(ADDRESS_FILE, 'utf8');
    const addressMap = {};
    
    // Look for getter function patterns like getSeaportAddress, getMorphoBlueAddress, etc.
    const functionMatches = addressContent.match(/function\s+get(\w+)Address\(\)/g) || [];
    
    for (const functionMatch of functionMatches) {
      // Extract the contract name from the function name
      const nameMatch = functionMatch.match(/get(\w+)Address/);
      if (!nameMatch) continue;
      
      const contractName = nameMatch[1];
      
      // Find the Tatara testnet address for this contract
      const pattern = new RegExp(`function\\s+get${contractName}Address\\(\\)[\\s\\S]*?else[\\s\\S]*?return\\s+(0x[a-fA-F0-9]{40})`);
      const addressMatch = addressContent.match(pattern);
      
      if (addressMatch && addressMatch[1]) {
        addressMap[contractName] = {
          tatara: addressMatch[1],
          mainnet: null // Placeholder for mainnet address
        };
      }
    }
    
    console.log('Found addresses for the following contracts:', Object.keys(addressMap));
    return addressMap;
  } catch (error) {
    console.error('Error extracting addresses:', error);
    return {};
  }
}

// Get all interface files recursively
function getAllFiles(dir, relativePath = '', fileMap = {}) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    
    if (stats.isDirectory()) {
      getAllFiles(filePath, join(relativePath, file), fileMap);
    } else if (file.endsWith('.sol')) {
      const key = join(relativePath, file).replace(/\\/g, '/');
      fileMap[key] = {
        path: filePath,
        relativePath: relativePath
      };
    }
  }
  
  return fileMap;
}

// Get all ABI files recursively
function getAllABIs(dir, relativePath = '', abiMap = {}) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    
    if (stats.isDirectory()) {
      getAllABIs(filePath, join(relativePath, file), abiMap);
    } else if (file.endsWith('.json')) {
      const key = join(relativePath, file).replace(/\\/g, '/');
      abiMap[key] = {
        path: filePath,
        relativePath: relativePath
      };
    }
  }
  
  return abiMap;
}

// Extract function signatures from ABI
function extractFunctionSignatures(abi) {
  const signatures = [];
  
  if (!Array.isArray(abi)) return signatures;
  
  for (const item of abi) {
    if (item.type === 'function') {
      let signature = `${item.name}(${(item.inputs || []).map(input => input.type).join(',')})`;
      let outputTypes = (item.outputs || []).map(output => output.type).join(',');
      let abiSignature = {
        name: item.name,
        signature,
        inputs: item.inputs || [],
        outputs: item.outputs || [],
        stateMutability: item.stateMutability
      };
      
      // Add signature to the list
      signatures.push(abiSignature);
    }
  }
  
  return signatures;
}

// Generate the contract directory
function generateContractDirectory() {
  const addresses = extractAddresses();
  const interfaceFiles = getAllFiles(INTERFACES_DIR);
  const abiFiles = getAllABIs(ABIS_DIR);
  
  const contractDir = [];
  
  // Process each interface file
  for (const [key, interfaceInfo] of Object.entries(interfaceFiles)) {
    const fileName = basename(key, '.sol');
    const abiKey = join(interfaceInfo.relativePath, `${fileName}.json`).replace(/\\/g, '/');
    
    // Get the interface content
    const interfaceContent = readFileSync(interfaceInfo.path, 'utf8');
    
    // Extract interface name - improved regex to match actual interface declarations not comments
    const interfaceMatch = interfaceContent.match(/(?:^|\n)\s*interface\s+(\w+)/);
    const interfaceName = interfaceMatch ? interfaceMatch[1] : fileName;
    
    // Try to find matching ABI
    let abi = null;
    let functionSignatures = [];
    if (abiFiles[abiKey]) {
      try {
        abi = JSON.parse(readFileSync(abiFiles[abiKey].path, 'utf8'));
        functionSignatures = extractFunctionSignatures(abi);
      } catch (err) {
        console.warn(`Warning: Could not parse ABI for ${abiKey}`);
      }
    }
    
    // Find if we have an address for this contract
    let address = null;
    
    // Try to match by name (remove leading 'I' if present)
    let contractName = interfaceName;
    if (contractName.startsWith('I')) {
      contractName = contractName.substring(1);
    }
    
    // Enhanced name matching
    for (const [addrContractName, addrInfo] of Object.entries(addresses)) {
      // Case 1: Direct match after removing 'I' prefix
      if (contractName === addrContractName) {
        address = addrInfo;
        console.log(`Found exact address match: ${contractName} -> ${addrContractName}`);
        break;
      }
      
      // Case 2: Contract name contains our address name or vice versa (case insensitive)
      const lowerContractName = contractName.toLowerCase();
      const lowerAddrName = addrContractName.toLowerCase();
      
      if (lowerContractName.includes(lowerAddrName) || lowerAddrName.includes(lowerContractName)) {
        address = addrInfo;
        console.log(`Found partial address match: ${contractName} -> ${addrContractName}`);
        break;
      }
      
      // Case 3: Special case for file-based matching with IMorphoBlue.sol
      if (key === 'IMorphoBlue.sol' && addrContractName === 'MorphoBlue') {
        address = addrInfo;
        console.log(`Found special case match for: ${key} -> ${addrContractName}`);
        break;
      }

      // Case 4: Special case for fuzzy matching - "combines" is actually IMorphoBlue
      if (interfaceName === 'combines' && key === 'IMorphoBlue.sol' && addrContractName === 'MorphoBlue') {
        address = addrInfo;
        console.log(`Found special fuzzy match for: ${interfaceName} (${key}) -> ${addrContractName}`);
        break;
      }
    }
    
    // Create contract entry
    const contract = {
      name: interfaceName,
      path: key,
      relativePath: interfaceInfo.relativePath,
      address,
      abi,
      functionSignatures
    };
    
    contractDir.push(contract);
  }
  
  // Sort contracts by name for consistency
  contractDir.sort((a, b) => a.name.localeCompare(b.name));
  
  return contractDir;
}

// Main execution
const contractDir = generateContractDirectory();

// Write full directory
writeFileSync(FULL_OUTPUT, JSON.stringify(contractDir, null, 2));
console.log(`Full contract directory written to ${FULL_OUTPUT}`);

// Write sample directory (first SAMPLE_SIZE entries)
const sampleDir = contractDir.slice(0, SAMPLE_SIZE);
writeFileSync(SAMPLE_OUTPUT, JSON.stringify(sampleDir, null, 2));
console.log(`Sample contract directory written to ${SAMPLE_OUTPUT}`);

// Print some stats
console.log('\nDirectory Statistics:');
console.log(`  - Total contracts: ${contractDir.length}`);
console.log(`  - Contracts with ABIs: ${contractDir.filter(c => c.abi !== null).length}`);
console.log(`  - Contracts with Tatara addresses: ${contractDir.filter(c => c.address !== null).length}`);
console.log(`  - Total function signatures: ${contractDir.reduce((sum, c) => sum + c.functionSignatures.length, 0)}`);

console.log('\nGeneration complete!'); 