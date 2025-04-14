# Katana Development Scripts

This folder contains utility scripts for Katana and Tatara development.

## Tatara Chain Forking

There are two ways to create a local fork of the Tatara testnet:

### Using Anvil (Recommended)

The Anvil forking approach uses a simple bash script to start Anvil directly,
which is more reliable than spawning it from a Node.js process. It allows you
to:

- Test interactions with Tatara contracts without spending gas
- Use MetaMask or other wallets with your local fork
- Verify contract states and experiment with modifications

#### Prerequisites

1. Install [Foundry](https://book.getfoundry.sh/getting-started/installation)
2. Install [Bun](https://bun.sh/)
3. Make sure you have a Tatara RPC URL in your `.env` file.

#### Usage

This is a two-step process (run in separate terminals):

#### Terminal 1: Start Anvil

```bash
bun run start:anvil:tatara
```

This will start Anvil with a local fork of the Tatara blockchain.

#### Terminal 2: Verify the Fork

```bash
bun run verify:anvil:tatara
```

This will verify that the fork is working correctly by checking contract states
and the connection.

### Using TEVM (Alternative)

The `tatara_bun.js` script creates a local fork using TEVM.

```bash
bun run start:tevm:tatara
```

> Note: While TEVM is more lightweight, it may have some compatibility issues
> with standard Ethereum clients. The Anvil approach is more compatible with
> production tools.

### Connecting to the Fork

In MetaMask or other wallets:

- **Network Name**: Tatara Local Fork
- **RPC URL**: `http://localhost:8545`
- **Chain ID**: 471
- **Currency Symbol**: ETH

### Extending the Scripts

You can extend these scripts to:

- Add more contract interactions
- Simulate transactions
- Test complex protocol interactions
- Create a local development environment with custom state

### Troubleshooting

If you encounter issues:

- **RPC issues**: Ensure your Tatara RPC URL is correct and accessible
- **Contract errors**: Check that the contract addresses are correct
- **Connection issues**: Make sure port 8545 is not being used by another application
- **Anvil not found**: Make sure Foundry is installed and `anvil` is in your PATH
- **Script not executable**: Run `chmod +x scripts/start_anvil.sh` to make the
  script executable

  ## Other Scripts

  See [general README](../README.md) and
  [interfaces README](../interfaces/README.md) to learn about the purpose of the
  other scripts.