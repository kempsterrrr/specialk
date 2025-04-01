# TEVM Scripts

This directory contains scripts for interacting with the Katana ecosystem using TEVM.

## TEVM Tatara Fork

The `tevm-tatara.ts` script creates a local fork of the Tatara testnet using TEVM. This allows you to:

- Test interactions with deployed contracts without spending actual gas
- Read state from contracts on the Tatara network
- Simulate transactions against deployed contracts
- Set up local development with a realistic state copy

### Running the Script

First, make sure you have set the required environment variables:

1. Copy `.env.example` to `.env` in the project root
2. Set your Tatara RPC URL in the `.env` file (this is required!)

```bash
# Run with the RPC URL from your .env file
deno task tevm:tatara

# Or provide the RPC URL directly
TATARA_RPC_URL=https://your-custom-rpc.example deno task tevm:tatara
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