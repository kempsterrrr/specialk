# Katana Development Scripts

This folder contains utility scripts for Katana and Tatara development.

## Tatara Chain Forking

### Using Bun (Recommended)

The `tatara_bun.js` script creates a local fork of the Tatara testnet using TEVM, allowing you to:

- Test interactions with Tatara contracts without spending gas
- Use MetaMask or other wallets with your local fork
- Verify contract states and experiment with modifications

#### Prerequisites

1. Install [Bun](https://bun.sh/)
2. Make sure you have a Tatara RPC URL in your `.env` file:
   ```
   TATARA_RPC_URL=https://your-tatara-rpc-url
   ```

#### Usage

Run the following command:

```bash
bun run fork:tatara
```

The script will:
1. Connect to the Tatara RPC
2. Create a local fork of the Tatara blockchain
3. Verify several contracts including AUSD, WETH, and MorphoBlue
4. Start a local RPC server at http://localhost:8545

#### Connecting to the Fork

In MetaMask or other wallets:
- **Network Name**: Tatara Local Fork
- **RPC URL**: http://localhost:8545
- **Chain ID**: 471
- **Currency Symbol**: ETH

### Using Deno

The `tevm-tatara.ts` script provides similar functionality using Deno.

#### Prerequisites

1. Install [Deno](https://deno.land/)
2. Make sure you have a Tatara RPC URL in your `.env` file

#### Usage

```bash
deno task tevm:tatara
```

### What the Script Does

1. Sets up a TEVM node that forks from the Tatara testnet
2. Verifies the fork is working by checking the chain ID
3. Reads ERC20 data from AUSD and WETH tokens
4. Reads configuration data from the MorphoBlue protocol
5. Reports all data to the console

The script includes detailed logging at each step to help diagnose any issues.

### Extending the Script

You can extend this script to:

- Add more contract interactions
- Simulate transactions
- Test complex protocol interactions
- Create a local development environment

### Troubleshooting

If you encounter issues:

- **Script hangs**: The script now includes a 60-second timeout for the TEVM node initialization. If it exceeds this time, it will exit with an error.
- **RPC issues**: Ensure your Tatara RPC URL is correct and accessible. The script requires this to be set.
- **Contract errors**: Check that the contract addresses are correct and that your ABI matches the deployed contracts.
- **Debug mode**: The script uses debug-level logging to provide more information about its execution.

If the TEVM node fails to connect, try:

1. Checking your internet connection
2. Using a different RPC provider for Tatara
3. Ensuring your RPC has adequate rate limits for the calls being made 