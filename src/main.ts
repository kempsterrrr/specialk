import { createPublicClient, createWalletClient, http, custom, formatEther, formatUnits } from 'viem';
import { parseAbi } from 'viem';

// Contract addresses
const ADDRESSES = {
  AUSD: '0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC',
  WETH: '0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4',
  MORPHO_BLUE: '0xC263190b99ceb7e2b7409059D24CB573e3bB9021'
};

// ABIs
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

// DOM Elements
const networkIndicator = document.getElementById('network-indicator') as HTMLElement;
const networkName = document.getElementById('network-name') as HTMLElement;
const walletStatus = document.getElementById('wallet-status') as HTMLElement;
const connectWalletButton = document.getElementById('connect-wallet') as HTMLButtonElement;
const ausdDataElement = document.getElementById('ausd-data') as HTMLElement;
const wethDataElement = document.getElementById('weth-data') as HTMLElement;
const morphoDataElement = document.getElementById('morpho-data') as HTMLElement;

// Check for wallet
const hasEthereum = typeof window !== 'undefined' && window.ethereum;

// Create clients
let publicClient: any;
let walletClient: any;

// Setup
async function initialize() {
  try {
    // Create a public client with custom timeout and retry options
    publicClient = createPublicClient({
      transport: http('http://localhost:8545', {
        timeout: 10000, // 10 seconds
        fetchOptions: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      }),
      batch: {
        multicall: false // Disable multicall to avoid JSON parsing issues
      }
    });

    // Check if the RPC is actually responding
    try {
      // Get network information
      const chainId = await publicClient.getChainId();
      
      if (chainId === 471) {
        updateNetworkStatus('connected', 'Tatara');
        // Load data from contracts
        loadContractData();
      } else {
        updateNetworkStatus('error', `Wrong network: ${chainId}`);
      }
    } catch (error) {
      console.error('RPC connection error:', error);
      updateNetworkStatus('error', 'Fork not running');
      displayRpcError();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    updateNetworkStatus('error', 'Connection error');
    displayRpcError();
  }

  // Handle wallet connection separately from RPC connection
  if (!hasEthereum) {
    walletStatus.textContent = 'No wallet detected';
  }
}

// Display RPC connection error
function displayRpcError() {
  const errorMessage = `
    <div class="error-message">
      <h4>⚠️ RPC Connection Error</h4>
      <p>Make sure you've started the local Tatara fork with:</p>
      <pre>bun run fork:tatara</pre>
      <p>Your local RPC should be running at http://localhost:8545</p>
    </div>
  `;

  // Display error in all contract data elements
  ausdDataElement.innerHTML = errorMessage;
  wethDataElement.innerHTML = errorMessage;
  morphoDataElement.innerHTML = errorMessage;
}

// Update network status indicator
function updateNetworkStatus(status: 'connected' | 'error' | 'warning', name: string) {
  networkIndicator.className = status;
  networkName.textContent = name;
}

// Connect wallet
async function connectWallet() {
  if (!hasEthereum) {
    alert('Please install MetaMask or another Ethereum wallet');
    return;
  }

  try {
    // Request account access
    walletClient = createWalletClient({
      transport: custom(window.ethereum)
    });
    
    const accounts = await walletClient.requestAddresses();
    
    if (accounts.length > 0) {
      walletStatus.textContent = `Connected: ${shortenAddress(accounts[0])}`;
      connectWalletButton.textContent = 'Connected';
      connectWalletButton.disabled = true;
    }
  } catch (error) {
    console.error('Connection error:', error);
    walletStatus.textContent = 'Connection failed';
  }
}

// Shorten address for display
function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Load AUSD Token data
async function loadAUSDData() {
  try {
    // Load data sequentially to avoid batching issues
    const name = await publicClient.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'name'
    });
    
    const symbol = await publicClient.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'symbol'
    });
    
    const decimals = await publicClient.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'decimals'
    });
    
    const totalSupply = await publicClient.readContract({
      address: ADDRESSES.AUSD,
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });

    // Format and display data
    ausdDataElement.innerHTML = '';
    ausdDataElement.classList.add('loaded');

    const formattedData = [
      { label: 'Name', value: name },
      { label: 'Symbol', value: symbol },
      { label: 'Decimals', value: decimals.toString() },
      { label: 'Total Supply', value: `${formatUnits(totalSupply, decimals)} ${symbol}` }
    ];

    formattedData.forEach(item => {
      const dataItem = document.createElement('div');
      dataItem.className = 'data-item';
      dataItem.innerHTML = `
        <div class="label">${item.label}</div>
        <div class="value">${item.value}</div>
      `;
      ausdDataElement.appendChild(dataItem);
    });
  } catch (error) {
    console.error('Error loading AUSD data:', error);
    ausdDataElement.innerHTML = '<p>Error loading data. Make sure the Tatara fork is running.</p>';
  }
}

// Load WETH Token data
async function loadWETHData() {
  try {
    // Load data sequentially to avoid batching issues
    const name = await publicClient.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'name'
    });
    
    const symbol = await publicClient.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'symbol'
    });
    
    const totalSupply = await publicClient.readContract({
      address: ADDRESSES.WETH,
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });

    // Format and display data
    wethDataElement.innerHTML = '';
    wethDataElement.classList.add('loaded');

    const formattedData = [
      { label: 'Name', value: name },
      { label: 'Symbol', value: symbol },
      { label: 'Total Supply', value: `${formatEther(totalSupply)} ${symbol}` }
    ];

    formattedData.forEach(item => {
      const dataItem = document.createElement('div');
      dataItem.className = 'data-item';
      dataItem.innerHTML = `
        <div class="label">${item.label}</div>
        <div class="value">${item.value}</div>
      `;
      wethDataElement.appendChild(dataItem);
    });
  } catch (error) {
    console.error('Error loading WETH data:', error);
    wethDataElement.innerHTML = '<p>Error loading data. Make sure the Tatara fork is running.</p>';
  }
}

// Load MorphoBlue data
async function loadMorphoData() {
  try {
    // Load data sequentially to avoid batching issues
    const owner = await publicClient.readContract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'owner'
    });
    
    const feeRecipient = await publicClient.readContract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'feeRecipient'
    });

    // Check if 50% LLTV is enabled
    const lltv50Percent = 5000n; // 50% in basis points
    const isLltv50Enabled = await publicClient.readContract({
      address: ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'isLltvEnabled',
      args: [lltv50Percent]
    });

    // Format and display data
    morphoDataElement.innerHTML = '';
    morphoDataElement.classList.add('loaded');

    const formattedData = [
      { label: 'Owner', value: shortenAddress(owner) },
      { label: 'Fee Recipient', value: shortenAddress(feeRecipient) },
      { label: '50% LLTV Enabled', value: isLltv50Enabled ? 'Yes' : 'No' }
    ];

    formattedData.forEach(item => {
      const dataItem = document.createElement('div');
      dataItem.className = 'data-item';
      dataItem.innerHTML = `
        <div class="label">${item.label}</div>
        <div class="value">${item.value}</div>
      `;
      morphoDataElement.appendChild(dataItem);
    });
  } catch (error) {
    console.error('Error loading MorphoBlue data:', error);
    morphoDataElement.innerHTML = '<p>Error loading data. Make sure the Tatara fork is running.</p>';
  }
}

// Load all contract data
async function loadContractData() {
  // Load data sequentially to avoid batching issues
  try {
    await loadAUSDData();
    await loadWETHData();
    await loadMorphoData();
  } catch (error) {
    console.error('Failed to load contract data:', error);
  }
}

// Add error styles
const style = document.createElement('style');
style.textContent = `
  .error-message {
    background-color: #fef2f2;
    border: 1px solid #fee2e2;
    border-radius: 6px;
    padding: 12px;
    margin-top: 10px;
  }
  
  .error-message h4 {
    color: #dc2626;
    margin-bottom: 8px;
  }
  
  .error-message pre {
    background-color: #f1f5f9;
    padding: 8px;
    border-radius: 4px;
    margin: 8px 0;
    overflow-x: auto;
  }
`;
document.head.appendChild(style);

// Event listeners
connectWalletButton.addEventListener('click', connectWallet);

// Initialize the app
initialize();

// Add window.ethereum type
declare global {
  interface Window {
    ethereum: any;
  }
}
