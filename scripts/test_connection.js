#!/usr/bin/env node
import { createPublicClient, http, parseAbi, formatEther } from 'viem';

const PORT = 8545;
const LOCAL_RPC_URL = `http://localhost:${PORT}`;

// Contract addresses on Tatara
const ADDRESSES = {
  AUSD: '0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC',
  WETH: '0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4'
};

// Simple ERC20 ABI
const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)'
]);

async function testConnection() {
  console.log(`🔍 Testing connection to: ${LOCAL_RPC_URL}`);
  
  try {
    // Create a standard viem client - exactly like our frontend does
    const client = createPublicClient({
      transport: http(LOCAL_RPC_URL)
    });
    
    // Test basic connection
    console.log('Checking basic connection...');
    const blockNumber = await client.getBlockNumber();
    console.log(`✅ Connected! Current block: ${blockNumber}`);
    
    // Test chain ID
    const chainId = await client.getChainId();
    console.log(`✅ Chain ID: ${chainId}`);
    
    // Test contract read
    console.log('\nTesting contract reads:');
    
    // Read AUSD token data
    console.log('\n🪙 Reading AUSD contract...');
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
    
    console.log(`✅ AUSD Name: ${ausdName}`);
    console.log(`✅ AUSD Symbol: ${ausdSymbol}`);
    
    // Read WETH token data
    console.log('\n🪙 Reading WETH contract...');
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
    
    console.log(`✅ WETH Name: ${wethName}`);
    console.log(`✅ WETH Symbol: ${wethSymbol}`);
    console.log(`✅ WETH Total Supply: ${formatEther(wethTotalSupply)} WETH`);
    
    console.log('\n🎉 All tests passed! Your local Anvil fork is working correctly.');
    console.log('The frontend application should be able to connect without issues.');
    
    return true;
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error(error);
    
    console.log('\n🛠️ Troubleshooting tips:');
    console.log('1. Make sure your Anvil fork is running on port 8545');
    console.log('2. Check that your Tatara RPC_URL in .env is valid');
    console.log('3. Try restarting the Anvil fork with: bun run fork:anvil');
    
    return false;
  }
}

// Run if this file is executed directly
if (process.argv[1] === import.meta.url.substring(7)) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testConnection }; 