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
  
  const client = createMemoryClient({
    fork: {
      transport: http(TATARA_RPC_URL),
    },
    miningConfig: {
      type: 'auto'
    },
    chainId: 471, // Tatara chain ID
    loggingLevel: 'info'
  });

  // Query AUSD contract (native stablecoin)
  console.log('\n📋 Verifying AUSD contract on Tatara:');
  try {
    const name = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'name'
    });

    const symbol = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'symbol'
    });

    const decimals = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'decimals'
    });

    const totalSupply = await client.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });

    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Total Supply: ${formatUnits(totalSupply, decimals)} ${symbol}`);
  } catch (error) {
    console.error('❌ Error accessing AUSD contract:', error);
    console.log('Continuing to check other contracts...');
  }

  // Query WETH contract
  console.log('\n📋 Verifying WETH contract on Tatara:');
  try {
    const name = await client.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'name'
    });

    const symbol = await client.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'symbol'
    });

    const totalSupply = await client.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });

    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Total Supply: ${formatEther(totalSupply)} ${symbol}`);
  } catch (error) {
    console.error('❌ Error accessing WETH contract:', error);
    console.log('Continuing to check other contracts...');
  }

  // Query MorphoBlue contract
  console.log('\n📋 Verifying MorphoBlue contract on Tatara:');
  try {
    const owner = await client.readContract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'owner'
    });

    const feeRecipient = await client.readContract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'feeRecipient'
    });

    // Test a specific LLTV value (50%)
    const lltv50Percent = 5000n; // 50% in basis points (50.00%)
    const isLltvEnabled = await client.readContract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'isLltvEnabled',
      args: [lltv50Percent]
    });

    console.log(`Owner: ${owner}`);
    console.log(`Fee Recipient: ${feeRecipient}`);
    console.log(`LLTV 50% Enabled: ${isLltvEnabled}`);
  } catch (error) {
    console.error('❌ Error accessing MorphoBlue contract:', error);
    console.log('Continuing to start server despite contract verification failure...');
  }

  // Start the server
  console.log('\n🚀 Starting Tatara fork server...');
  const server = createServer(client);
  
  server.listen(PORT, () => {
    console.log(`\n✅ Tatara fork server running at http://localhost:${PORT}`);
    console.log(`RPC URL: http://localhost:${PORT}`);
    console.log('Chain ID: 471 (Tatara)');
    console.log('\nConnect MetaMask or other wallets to this RPC endpoint');
    console.log('Press Ctrl+C to stop the server');
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down Tatara fork server...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 