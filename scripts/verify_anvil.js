#!/usr/bin/env node

import { parseAbi, formatEther, formatUnits, createPublicClient, http } from 'viem';

// Configuration
const PORT = 8545;
const LOCAL_RPC_URL = `http://localhost:${PORT}`;

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

// Verify contracts by connecting to the fork
async function verifyContracts() {
  console.log('\n📋 Verifying contracts on the fork:');
  
  try {
    // Create a viem client connected to Anvil
    const client = createPublicClient({
      transport: http(LOCAL_RPC_URL),
    });

    // Wait for anvil to be fully ready 
    let retries = 10;
    while (retries > 0) {
      try {
        // Check if we can connect
        await client.getChainId();
        break;
      } catch (error) {
        console.log(`Waiting for Anvil to be ready... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries--;
        
        if (retries === 0) {
          throw new Error("Timed out waiting for Anvil to be ready");
        }
      }
    }

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
    
    // Print connection information
    console.log('\nYour Tatara fork is ready for use!');
    console.log('\nConnect MetaMask or other wallets to this RPC endpoint:');
    console.log('- Network Name: Tatara Local Fork');
    console.log(`- RPC URL: http://localhost:${PORT}`);
    console.log('- Chain ID: 471');
    console.log('- Currency Symbol: ETH');
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying contracts:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log(`🔍 Verifying Anvil fork at: ${LOCAL_RPC_URL}`);
  
  // Verify the contracts
  const success = await verifyContracts();
  
  if (success) {
    console.log("\nYou can leave the Anvil process running for as long as you need it.");
    console.log("Press Ctrl+C in the Anvil terminal to stop the server when done.");
  } else {
    console.error("\n❌ Failed to verify Anvil fork.");
    console.error("Make sure Anvil is running with the correct parameters:");
    console.error("anvil --fork-url $TATARA_RPC_URL --chain-id 471 --port 8545");
    process.exit(1);
  }
}

// Only run if executed directly
if (process.argv[1] === import.meta.url.substring(7)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { verifyContracts }; 