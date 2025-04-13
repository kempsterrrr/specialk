#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { execSync } from 'node:child_process';

// Constants
const INTERFACES_DIR = join(process.cwd(), 'interfaces');
const ABIS_DIR = join(process.cwd(), 'abis');
const KATANA_ADDRESS_FILE = join(INTERFACES_DIR, 'utils', 'KatanaAddresses.sol');
const TATARA_ADDRESS_FILE = join(INTERFACES_DIR, 'utils', 'TataraAddresses.sol');
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

if (!existsSync(KATANA_ADDRESS_FILE)) {
  console.error('Error: KatanaAddresses.sol file does not exist');
  process.exit(1);
}

if (!existsSync(TATARA_ADDRESS_FILE)) {
  console.warn('Warning: TataraAddresses.sol file does not exist. Will only use KatanaAddresses.sol.');
}

if (!existsSync(OUTPUT_DIR)) {
  execSync(`mkdir -p ${OUTPUT_DIR}`);
}

console.log('Generating contract directory files...');

// Define contexts and their theme colors
const CONTEXTS = {
  "morpho": {
    name: "morpho",
    color: "#6f4ff2" // Purple
  },
  "yearn": {
    name: "yearn",
    color: "#0657F9" // Blue
  },
  "sushi": {
    name: "sushi",
    color: "#fa52a0" // Pink
  },
  "seaport": {
    name: "seaport",
    color: "#2081e2" // OpenSea blue
  },
  "gnosis": {
    name: "gnosis",
    color: "#028390" // Teal
  },
  "account-abstraction": {
    name: "account-abstraction",
    color: "#ff7a00" // Orange
  },
  "bridge": {
    name: "bridge",
    color: "#e20b8c" // Magenta
  },
  "utility": {
    name: "utility",
    color: "#00b7c5" // Cyan
  },
  "deployment": {
    name: "deployment",
    color: "#8b5cf6" // Indigo
  },
  "token": {
    name: "token",
    color: "#10b981" // Green
  },
  "general": {
    name: "general",
    color: "#6b7280" // Gray
  }
};

// Extract addresses from KatanaAddresses.sol
function extractKatanaAddresses() {
  try {
    const addressContent = readFileSync(KATANA_ADDRESS_FILE, 'utf8');
    const addressMap = {};
    
    // Look for getter function patterns like getSeaportAddress, getMorphoBlueAddress, etc.
    const functionMatches = addressContent.match(/function\s+get(\w+)Address\(\)/g) || [];
    
    for (const functionMatch of functionMatches) {
      // Extract the contract name from the function name
      const nameMatch = functionMatch.match(/get(\w+)Address/);
      if (!nameMatch) continue;
      
      const contractName = nameMatch[1];
      
      // Find the Katana mainnet address for this contract
      const pattern = new RegExp(`function\\s+get${contractName}Address\\(\\)[\\s\\S]*?if\\s*\\([^)]*\\)\\s*{[\\s\\S]*?return\\s+(0x[a-fA-F0-9]{40}|address\\(0\\))`);
      const addressMatch = addressContent.match(pattern);
      
      let mainnetAddress = null;
      if (addressMatch && addressMatch[1] && addressMatch[1] !== 'address(0)') {
        mainnetAddress = addressMatch[1];
      }
      
      addressMap[contractName] = {
        tatara: null, // We'll fill this from TataraAddresses.sol
        mainnet: mainnetAddress
      };
    }
    
    console.log('Found Katana addresses for the following contracts:', Object.keys(addressMap));
    return addressMap;
  } catch (error) {
    console.error('Error extracting Katana addresses:', error);
    return {};
  }
}

// Extract addresses from TataraAddresses.sol
function extractTataraAddresses() {
  try {
    if (!existsSync(TATARA_ADDRESS_FILE)) {
      return {};
    }
    
    const addressContent = readFileSync(TATARA_ADDRESS_FILE, 'utf8');
    const addressMap = {};
    
    // Look for getter function patterns
    const functionMatches = addressContent.match(/function\s+get(\w+)Address\(\)/g) || [];
    
    for (const functionMatch of functionMatches) {
      // Extract the contract name from the function name
      const nameMatch = functionMatch.match(/get(\w+)Address/);
      if (!nameMatch) continue;
      
      const contractName = nameMatch[1];
      
      // Extract the address from the return statement
      const pattern = new RegExp(`function\\s+get${contractName}Address\\(\\)[^{]*{[^}]*return\\s+(0x[a-fA-F0-9]{40})`);
      const addressMatch = addressContent.match(pattern);
      
      if (addressMatch && addressMatch[1]) {
        addressMap[contractName] = addressMatch[1];
      }
    }
    
    console.log('Found Tatara addresses for the following contracts:', Object.keys(addressMap));
    return addressMap;
  } catch (error) {
    console.error('Error extracting Tatara addresses:', error);
    return {};
  }
}

// Merge Katana and Tatara addresses
function mergeAddresses() {
  const katanaAddresses = extractKatanaAddresses();
  const tataraAddresses = extractTataraAddresses();
  
  // Merge the two address maps
  const mergedAddresses = { ...katanaAddresses };
  
  // Add Tatara addresses to the merged map
  for (const [contractName, tataraAddress] of Object.entries(tataraAddresses)) {
    if (mergedAddresses[contractName]) {
      mergedAddresses[contractName].tatara = tataraAddress;
    } else {
      mergedAddresses[contractName] = {
        tatara: tataraAddress,
        mainnet: null
      };
    }
  }
  
  return mergedAddresses;
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

// Extract documentation comments from interface file
function extractInterfaceDescription(content) {
  // Find the main comment block before the interface declaration
  const commentBlockRegex = /\/\*\*([\s\S]*?)\*\/\s*interface\s+\w+/;
  const commentMatch = content.match(commentBlockRegex);
  
  if (!commentMatch) return null;
  
  const commentBlock = commentMatch[1];
  
  // Extract various tags
  const titleMatches = commentBlock.match(/@title\s+(.*?)(?=\s*\*\s*@|\s*\*\/)/gs) || [];
  const noticeMatches = commentBlock.match(/@notice\s+(.*?)(?=\s*\*\s*@|\s*\*\/)/gs) || [];
  const devMatches = commentBlock.match(/@dev\s+(.*?)(?=\s*\*\s*@|\s*\*\/)/gs) || [];
  const customAddressMatches = commentBlock.match(/@custom:address\s+(0x[a-fA-F0-9]{40})(?=\s*\*\s*@|\s*\*\/)/gs) || [];
  
  // Clean up the extracted comments
  const titles = titleMatches.map(title => 
    title.replace(/@title\s+/g, '').replace(/\s*\*\s*/g, ' ').trim()
  );
  
  const notices = noticeMatches.map(notice => 
    notice.replace(/@notice\s+/g, '').replace(/\s*\*\s*/g, ' ').trim()
  );
  
  const devs = devMatches.map(dev => 
    dev.replace(/@dev\s+/g, '').replace(/\s*\*\s*/g, ' ').trim()
  );
  
  const customAddresses = customAddressMatches.map(addr => 
    addr.replace(/@custom:address\s+/g, '').replace(/\s*\*\s*/g, ' ').trim()
  );
  
  // Combine all information in a structured way
  const description = {
    title: titles.length > 0 ? titles[0] : null,
    notice: notices.length > 0 ? notices.join(' ') : null,
    dev: devs.length > 0 ? devs.join(' ') : null,
    customAddress: customAddresses.length > 0 ? customAddresses[0] : null,
    full: ''
  };
  
  // Build a full text description
  let fullText = '';
  
  if (description.title) {
    fullText += description.title;
  }
  
  if (description.notice) {
    if (fullText) fullText += ': ';
    fullText += description.notice;
  }
  
  if (description.dev) {
    if (fullText) fullText += ' ';
    fullText += '(' + description.dev + ')';
  }
  
  description.full = fullText.trim() || null;
  
  return description;
}

// Determine the context for a contract based on its name, path, etc.
function determineContext(name, path, relativePath, description) {
  // Convert to lowercase for case-insensitive matching
  const nameLower = name.toLowerCase();
  const pathLower = path.toLowerCase();
  const relativeLower = relativePath ? relativePath.toLowerCase() : '';
  const desc = description ? description.toLowerCase() : '';
  
  // Morpho-related contracts
  if (
    nameLower.includes('morpho') || 
    pathLower.includes('morpho') || 
    desc.includes('morpho')
  ) {
    return CONTEXTS["morpho"];
  }
  
  // Yearn-related contracts
  if (
    nameLower.includes('yearn') || 
    nameLower.includes('yv') || 
    relativeLower.includes('yearn') ||
    desc.includes('yearn')
  ) {
    return CONTEXTS["yearn"];
  }
  
  // Sushi-related contracts
  if (
    nameLower.includes('sushi') || 
    pathLower.includes('sushi') ||
    desc.includes('sushi')
  ) {
    return CONTEXTS["sushi"];
  }
  
  // Seaport/OpenSea-related contracts
  if (
    nameLower.includes('seaport') || 
    nameLower.includes('conduit') || 
    pathLower.includes('seaport') ||
    desc.includes('seaport') ||
    desc.includes('opensea')
  ) {
    return CONTEXTS["seaport"];
  }
  
  // Gnosis Safe-related contracts
  if (
    nameLower.includes('gnosis') || 
    nameLower.includes('safe') || 
    pathLower.includes('gnosis') ||
    desc.includes('gnosis') ||
    desc.includes('multisig')
  ) {
    return CONTEXTS["gnosis"];
  }
  
  // Account Abstraction/ERC-4337-related contracts
  if (
    nameLower.includes('entrypoint') || 
    nameLower.includes('erc4337') || 
    pathLower.includes('aav0') ||
    relativeLower.includes('aav0') ||
    desc.includes('erc-4337') ||
    desc.includes('account abstraction')
  ) {
    return CONTEXTS["account-abstraction"];
  }
  
  // Bridge-related contracts
  if (
    nameLower.includes('bridge') || 
    nameLower.includes('sovereign') || 
    nameLower.includes('l2') ||
    pathLower.includes('bridge') ||
    desc.includes('bridge') ||
    desc.includes('cross-chain')
  ) {
    return CONTEXTS["bridge"];
  }
  
  // Utility contracts
  if (
    nameLower.includes('multicall') || 
    nameLower.includes('permit2') || 
    nameLower.includes('bundler') ||
    nameLower.includes('rip7212') ||
    desc.includes('utility') ||
    desc.includes('helper')
  ) {
    return CONTEXTS["utility"];
  }
  
  // Deployment-related contracts
  if (
    nameLower.includes('deploy') || 
    nameLower.includes('create2') || 
    nameLower.includes('createx') ||
    nameLower.includes('deterministic') ||
    desc.includes('deploy') ||
    desc.includes('creation')
  ) {
    return CONTEXTS["deployment"];
  }
  
  // Token-related contracts
  if (
    nameLower.includes('token') || 
    nameLower.includes('erc20') || 
    nameLower.includes('weth') ||
    nameLower.includes('ausd') ||
    nameLower.includes('usdc') ||
    nameLower.includes('usdt') ||
    nameLower.includes('dai') ||
    nameLower.includes('wbtc') ||
    nameLower.includes('yb') ||
    desc.includes('token') ||
    desc.includes('stablecoin')
  ) {
    return CONTEXTS["token"];
  }
  
  // Default context for anything else
  return CONTEXTS["general"];
}

// Generate the contract directory
function generateContractDirectory() {
  const addresses = mergeAddresses();
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
    
    // Extract interface description
    const description = extractInterfaceDescription(interfaceContent);
    
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
    
    // If we still don't have an address, check if there's a custom address in the comments
    if (!address && description && description.customAddress) {
      address = {
        tatara: description.customAddress,
        mainnet: description.customAddress // Assuming same address for both networks if specified in comments
      };
      console.log(`Found custom address for ${interfaceName} in comments: ${description.customAddress}`);
    }
    
    // Create contract entry with updated structure
    const context = determineContext(interfaceName, key, interfaceInfo.relativePath, description ? description.full : null);
    const contract = {
      name: interfaceName,
      path: key,
      relativePath: interfaceInfo.relativePath,
      description: description ? description.full : null,
      metadata: {
        title: description ? description.title : null,
        notice: description ? description.notice : null,
        dev: description ? description.dev : null
      },
      context: context.name,
      theme: context.color,
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