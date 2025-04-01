// tevm-tatara.ts - Creates a TEVM node forking Tatara testnet and reads state from contracts
import { createTevmNode, http, type TevmNode } from "tevm";
import { formatEther, formatUnits } from "viem";

// Contract addresses on Tatara
const TATARA_CHAIN_ID = 471;
const ADDRESSES = {
  AUSD: "0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC",
  WETH: "0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4",
  MORPHO_BLUE: "0xC263190b99ceb7e2b7409059D24CB573e3bB9021",
  SEAPORT: "0x0000000000FFe8B47B3e2130213B802212439497",
  SUSHI_ROUTER: "0xAC4c6e212A361c968F1725b4d055b47E63F80b75"
};

// ABIs for the contracts we want to interact with
const ERC20_ABI = [
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)"
];

// Simplified MorphoBlue ABI with just what we need
const MORPHO_BLUE_ABI = [
  "function owner() external view returns (address)",
  "function feeRecipient() external view returns (address)",
  "function isIrmEnabled(address irm) external view returns (bool)",
  "function isLltvEnabled(uint256 lltv) external view returns (bool)"
];

interface ERC20Data {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

interface MorphoBlueData {
  owner: string;
  feeRecipient: string;
}

async function main() {
  console.log("🚀 Starting TEVM Tatara fork script...");
  
  // Get RPC URL and validate it exists
  const rpcUrl = Deno.env.get("TATARA_RPC_URL");
  if (!rpcUrl) {
    console.error("❌ ERROR: TATARA_RPC_URL environment variable is required!");
    console.error("Please set it in your .env file or provide it when running the script:");
    console.error("TATARA_RPC_URL=https://your-rpc-url deno task tevm:tatara");
    Deno.exit(1);
  }
  
  console.log(`🔌 Using RPC URL: ${rpcUrl}`);
  console.log("⏳ Creating TEVM node...");
  
  // Create a TEVM node that forks from Tatara
  let node: TevmNode | undefined;
  try {
    node = createTevmNode({
      fork: {
        transport: http(rpcUrl),
      },
      miningConfig: {
        type: "auto", 
      },
      loggingLevel: "debug" // More verbose logging
    });
    
    console.log("⏳ TEVM node created, waiting for it to be ready...");
    
    // Set a timeout for the node.ready() call
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout: TEVM node initialization took too long")), 60000); // 60 second timeout
    });
    
    // Wait for the node to be ready with timeout
    await Promise.race([node.ready(), timeoutPromise]);
    console.log("✅ TEVM node ready!");
    
    console.log("⏳ Checking chain ID...");
    // Test connection by checking chain ID
    const chainId = await node.provider.request({
      method: "eth_chainId",
      params: [],
    });
    
    console.log(`Chain ID: ${parseInt(chainId as string, 16)}`);
    
    if (parseInt(chainId as string, 16) !== TATARA_CHAIN_ID) {
      throw new Error(`Wrong chain ID. Expected ${TATARA_CHAIN_ID}, got ${parseInt(chainId as string, 16)}`);
    }
    
    console.log("✅ Fork successful - connected to Tatara (Chain ID: 471)");
    
    // Read data from contracts
    console.log("\n📊 Reading contract data...");
    
    console.log("⏳ Reading AUSD token data...");
    // Check AUSD token
    const ausdData = await readERC20Data(node, ADDRESSES.AUSD);
    console.log("\n🪙 AUSD Token:");
    console.log(`  Name: ${ausdData.name}`);
    console.log(`  Symbol: ${ausdData.symbol}`);
    console.log(`  Decimals: ${ausdData.decimals}`);
    console.log(`  Total Supply: ${formatUnits(ausdData.totalSupply, ausdData.decimals)}`);
    
    console.log("⏳ Reading WETH token data...");
    // Check WETH token
    const wethData = await readERC20Data(node, ADDRESSES.WETH);
    console.log("\n🪙 WETH Token:");
    console.log(`  Name: ${wethData.name}`);
    console.log(`  Symbol: ${wethData.symbol}`);
    console.log(`  Decimals: ${wethData.decimals}`);
    console.log(`  Total Supply: ${formatEther(wethData.totalSupply)}`);
    
    console.log("⏳ Reading MorphoBlue contract data...");
    // Check MorphoBlue contract
    const morphoData = await readMorphoBlueData(node);
    console.log("\n🏦 MorphoBlue Contract:");
    console.log(`  Owner: ${morphoData.owner}`);
    console.log(`  Fee Recipient: ${morphoData.feeRecipient}`);
    
    // Test a specific LLTV value (50%)
    console.log("⏳ Checking LLTV value...");
    const lltv50Percent = 5000; // 50% in basis points (50.00%)
    const isLltvEnabled = await node.contract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: "isLltvEnabled",
      args: [lltv50Percent]
    });
    console.log(`  LLTV 50% Enabled: ${isLltvEnabled.data}`);
    
    console.log("\n✅ TEVM Tatara fork verification complete!");

  } catch (error) {
    console.error("❌ Error:", error);
    console.error("Stack trace:", (error as Error).stack);
    Deno.exit(1);
  }
}

async function readERC20Data(node: TevmNode, tokenAddress: string): Promise<ERC20Data> {
  console.log(`  - Querying contract at ${tokenAddress}`);
  try {
    const results = await Promise.all([
      // Call name()
      node.contract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "name",
      }).then(r => { console.log(`    ✓ name() successful`); return r; }),
      
      // Call symbol()
      node.contract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "symbol",
      }).then(r => { console.log(`    ✓ symbol() successful`); return r; }),
      
      // Call decimals()
      node.contract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }).then(r => { console.log(`    ✓ decimals() successful`); return r; }),
      
      // Call totalSupply()
      node.contract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      }).then(r => { console.log(`    ✓ totalSupply() successful`); return r; })
    ]);
    
    return {
      name: results[0].data as string,
      symbol: results[1].data as string,
      decimals: results[2].data as number,
      totalSupply: results[3].data as bigint
    };
  } catch (error) {
    console.error(`  ❌ Error reading ERC20 data for ${tokenAddress}:`, error);
    throw error;
  }
}

async function readMorphoBlueData(node: TevmNode): Promise<MorphoBlueData> {
  console.log(`  - Querying MorphoBlue contract at ${ADDRESSES.MORPHO_BLUE}`);
  try {
    const results = await Promise.all([
      // Call owner()
      node.contract({
        address: ADDRESSES.MORPHO_BLUE,
        abi: MORPHO_BLUE_ABI,
        functionName: "owner",
      }).then(r => { console.log(`    ✓ owner() successful`); return r; }),
      
      // Call feeRecipient()
      node.contract({
        address: ADDRESSES.MORPHO_BLUE,
        abi: MORPHO_BLUE_ABI,
        functionName: "feeRecipient",
      }).then(r => { console.log(`    ✓ feeRecipient() successful`); return r; })
    ]);
    
    return {
      owner: results[0].data as string,
      feeRecipient: results[1].data as string
    };
  } catch (error) {
    console.error(`  ❌ Error reading MorphoBlue data:`, error);
    throw error;
  }
}

// Run the main function directly - don't wait for import.meta.main check
// When running as deno task, this check might not work as expected
main(); 