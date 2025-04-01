#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process';
import { parseAbi, formatEther, formatUnits, createPublicClient, http } from 'viem';

// Configuration
const PORT = 8545; // Port for the local RPC server

// Get RPC URL from environment variable
const TATARA_RPC_URL = process.env.TATARA_RPC_URL;
if (!TATARA_RPC_URL) {
  console.error('❌ Error: TATARA_RPC_URL environment variable is not set');
  console.error('Please set it in your .env file');
  process.exit(1);
}

// Contract addresses on Tatara
const ADDRESSES = {
  AUSD: '0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC',
  WETH: '0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4',
  MORPHO_BLUE: '0xC263190b99ceb7e2b7409059D24CB573e3bB9021'
};

// ABIs for the contracts we want to interact with
const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)'
]);

const MORPHO_BLUE_ABI = parseAbi([
  'function owner() view returns (address)',
  'function feeRecipient() view returns (address)',
  'function isLltvEnabled(uint256 lltv) view returns (bool)'
]);

// Check if anvil is installed
function checkAnvilInstalled() {
  try {
    execSync('which anvil', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Start an Anvil fork of Tatara
async function startAnvilFork() {
  if (!checkAnvilInstalled()) {
    console.error('❌ Error: anvil is not installed');
    console.error('Please install Foundry: https://book.getfoundry.sh/getting-started/installation');
    process.exit(1);
  }

  console.log('⚡ Starting local Tatara fork with Anvil...');

  // Start anvil with Tatara fork
  const anvilProcess = spawn('anvil', [
    '--fork-url', TATARA_RPC_URL,
    '--chain-id', '471',
    '--port', PORT.toString(),
    '--block-time', '12', // Optional: Automine blocks every 12 seconds
    '--silent'  // Reduce logging noise
  ], {
    stdio: ['inherit', 'pipe', 'inherit']
  });

  // Wait for anvil to start
  await new Promise((resolve) => {
    anvilProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Listening on')) {
        resolve();
      }
      // Echo anvil output for debugging
      process.stdout.write(data);
    });
  });

  console.log(`\n✅ Anvil running at http://localhost:${PORT}`);
  console.log('Chain ID: 471 (Tatara)');
  
  // Setup clean exit on Ctrl+C
  process.on('SIGINT', () => {
    console.log('\nShutting down Anvil fork...');
    anvilProcess.kill();
    process.exit(0);
  });

  return anvilProcess;
}

// Verify contracts by connecting to the fork
async function verifyContracts() {
  console.log('\n📋 Verifying contracts on the fork:');
  
  try {
    // Create a viem client connected to Anvil
    const client = createPublicClient({
      transport: http(`http://localhost:${PORT}`),
    });

    // Verify chain ID is correct
    const chainId = await client.getChainId();
    if (chainId !== 471) {
      throw new Error(`Expected chain ID 471, got ${chainId}`);
    }
    console.log('✅ Chain ID verified: 471 (Tatara)');

    // Query AUSD contract
    console.log('\n🪙 Checking AUSD contract...');
    
    // Use sequential requests to verify contract state
    const ausdName = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'name'
    });
    
    const ausdSymbol = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'symbol'
    });
    
    const ausdDecimals = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'decimals'
    });
    
    const ausdTotalSupply = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });
    
    console.log(`Name: ${ausdName}`);
    console.log(`Symbol: ${ausdSymbol}`);
    console.log(`Decimals: ${ausdDecimals}`);
    console.log(`Total Supply: ${formatUnits(ausdTotalSupply, ausdDecimals)} ${ausdSymbol}`);
    
    // Query WETH contract
    console.log('\n🪙 Checking WETH contract...');
    
    const wethName = await client.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'name'
    });
    
    const wethSymbol = await client.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'symbol'
    });
    
    const wethTotalSupply = await client.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });
    
    console.log(`Name: ${wethName}`);
    console.log(`Symbol: ${wethSymbol}`);
    console.log(`Total Supply: ${formatEther(wethTotalSupply)} ${wethSymbol}`);
    
    console.log('\n✅ Contract verification successful!');
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying contracts:', error);
    return false;
  }
}

// Main function
async function main() {
  // Start anvil fork
  const anvilProcess = await startAnvilFork();
  
  // Wait a moment for Anvil to fully initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Verify the contracts
  await verifyContracts();
  
  console.log('\nYour Tatara fork is ready for use!');
  console.log('\nConnect MetaMask or other wallets to this RPC endpoint:');
  console.log('- Network Name: Tatara Local Fork');
  console.log(`- RPC URL: http://localhost:${PORT}`);
  console.log('- Chain ID: 471');
  console.log('- Currency Symbol: ETH');
  
  console.log('\nPress Ctrl+C to stop the server');
  
  // Keep process running until Ctrl+C
  await new Promise(() => {});
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 