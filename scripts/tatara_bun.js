import { http, createMemoryClient } from 'tevm';
import { parseAbi, formatEther, formatUnits } from 'viem';
import { createServer } from 'tevm/server';

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

async function main() {
  console.log('⚡ Creating local Tatara fork...');
  
  try {
    const client = createMemoryClient({
      fork: {
        transport: http(TATARA_RPC_URL, {
          timeout: 30000, // 30 seconds timeout
          fetchOptions: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        }),
      },
      miningConfig: {
        type: 'auto'
      },
      chainId: 471, // Tatara chain ID
      loggingLevel: 'error' // Only show errors
    });

    console.log('⏳ Connecting to Tatara and creating local fork...');
    
    // Set up the server with CORS enabled
    const server = createServer(client, {
      corsOrigin: '*' // Allow requests from any origin
    });
    
    // Start the server first
    await new Promise((resolve) => {
      server.listen(PORT, resolve);
    });
    
    console.log(`\n✅ Tatara fork server running at http://localhost:${PORT}`);
    console.log(`RPC URL: http://localhost:${PORT}`);
    console.log('Chain ID: 471 (Tatara)');
    
    // Verify contracts after the server is running
    console.log('\n📋 Verifying contracts on the fork:');
    
    try {
      // Query AUSD contract (native stablecoin)
      console.log('\n🪙 Checking AUSD contract...');
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
    } catch (error) {
      console.error('❌ Error verifying contracts:', error);
      console.log('Server is still running, you can connect to it, but some contracts might not be accessible.');
    }
    
    console.log('\nConnect MetaMask or other wallets to this RPC endpoint');
    console.log('Press Ctrl+C to stop the server');

    // Handle server shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down Tatara fork server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Fatal error creating the fork:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 