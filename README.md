# Katana Development Starter Kit

![Box of legos](leo.jpg)

## 🚀 Introduction

Welcome to the **Katana Development Starter Kit**! This repository serves as
your launchpad for building on **Katana** and its testnets **Tatara** and **Bokuto**.

This kit provides:

- **Bun-based development environment** 🧅
- **Anvil + Foundry integration** for reliable local chain forks
- **Pre-configured build system** using Esbuild & TypeScript
- **[UI-kit CSS](https://getuikit.com/)**, optional to use
- **[viem](https://viem.sh/)** for blockchain interactions
- **Example contracts** to help you integrate with **Katana's money legos** and
  interfaces for all deployed contracts on Katana and testnets
- **Foundry setup** for smart contract development and testing
- **Static File Handling** (HTML, CSS, and assets copied to `dist/`, easy to
  host on IPFS or any static file hosting service)
- **Contract address mapping generator** for easy access to deployed contract
  addresses in JavaScript
- **Foundry MCP Server** for AI-assisted smart contract development
- Script to generate a single file contract directory with all the ABIs,
  contract names, paths, descriptions, addresses, and context they belong to,
  for directory browsers like the [contract dir](https://contracts.katana.tools)

Whether you're building yield strategies, cross-chain intent-based execution,
or novel DeFi protocols**, this starter kit helps you bootstrap your project
**fast**.

- [More about contract interfaces](/interfaces/README.md)
- [More about running Katana locally for development](/scripts/README.md)

## Chain information

### Katana

| Property                        | Value                                         |
|----------------------------------|-----------------------------------------------|
| **Chain Name**                   | Katana                                        |
| **Chain ID**                     | `747474`                                      |
| **Public RPC URL**               | [https://rpc.katana.network/](https://rpc.katana.network/) |
| **Gas Token**                    | ETH                                           |
| **Block Explorer**               | [https://katanascan.com/](https://katanascan.com/) |
| **Block Time**                   | 1 second                                      |
| **Block Gas Limit**              | 60M units                                     |
| **Block Gas Target**             | 30M units                                     |
| **Gas Pricing**                  | EIP1559                                       |
| **EIP-1559 Elasticity Multiplier** | 60                                          |
| **EIP-1559 Denominator**         | 250                                           |
| **Data Availability**            | EIP4844                                       |
| **Account Abstraction**          | EIP7702                                       |

---

### Bokuto

| Property         | Value                                              |
|------------------|----------------------------------------------------|
| **Chain Name**   | Bokuto                                             |
| **Chain ID**     | `737373`                                           |
| **RPC URL**      | [https://rpc-bokuto.katanarpc.com](https://rpc-bokuto.katanarpc.com) |
| **Block Explorer**      | [https://explorer-bokuto.katanarpc.com/](https://explorer-bokuto.katanarpc.com/) |
| **Gas Token**           | ETH                                                                   |
| **Block Time**          | 1 second                                                              |
| **Gas Block Limit**     | 60M units                                                             |
| **Gas Pricing**         | EIP1559                                                               |
| **Data Availability**   | EIP4844                                                               |

---

### Tatara

| Property                | Value                                                                 |
|-------------------------|-----------------------------------------------------------------------|
| **Network Name**        | Tatara Network (aka Katana Testnet)                                   |
| **Chain ID**            | `129399`                                                              |
| **RPC URL**             | `https://rpc.tatara.katanarpc.com/<apikey>`                           |
| **Block Explorer**      | [https://explorer.tatara.katana.network/](https://explorer.tatara.katana.network/) |
| **Vault Bridge Faucet** | [https://faucet-api.polygon.technology/api-docs/](https://faucet-api.polygon.technology/api-docs/) |
| **Bridge UI**           | [https://portal-staging.polygon.technology/bridge](https://portal-staging.polygon.technology/bridge) |
| **Gas Token**           | ETH                                                                   |
| **Block Time**          | 1 second                                                              |
| **Gas Block Limit**     | 60M units                                                             |
| **Gas Pricing**         | EIP1559                                                               |
| **Data Availability**   | EIP4844                                                               |

---

## 🛠 Setup & Installation

### 1️⃣ **Install Dependencies**

Copy `.env.example` into `.env` and add in your RPC endpoints if you want to
change them (recommended: to prevent rate limiting).

Ensure you have the required tools installed:

- [Bun](https://bun.sh/) - Follow the installation instructions at <https://bun.sh/>
- [Foundry](https://book.getfoundry.sh/) for contract development and local
  chain forks
- [Git](https://git-scm.com/)

After installing Bun, run:

```sh
# Install project dependencies
bun install
```

### 2️⃣ **Run the Build System**

This project uses **Bun** as its runtime and **Esbuild** for bundling. To build
your project, run:

```sh
bun run build:all
```

This will:

- Compile and minify the example TypeScript code
- Copy HTML & static assets to `./dist`
- Prepare the environment for deployment
- Compile helper utilities like an address-to-contract mapping in
  `utils/addresses` and interface ABIs in the `/abis` folder as well as address
  lookup Solidity contracts in `contracts/utils`.
- Build the Foundry MCP server for AI-assisted development

🚨 Note: Going forward, you can just rebuild the web app using `bun run build`.

### 3️⃣ **Local Chain Forking**.

#### Environment Setup

Create a `.env` file by copying `.env.example`. If you want non-rate-limited
access, replace the RPC endpoints there with your own, otherwise, use the
defaults.

```bash
# Copy and customize based on your available RPC endpoints
TATARA_RPC_URL=https://rpc.tatara.network
BOKUTO_RPC_URL=https://rpc.bokuto.network  
KATANA_RPC_URL=https://rpc.katana.network
```

#### Terminal 1: Start Anvil Fork

```sh
# Fork Tatara testnet
bun run start:anvil tatara

# Or fork Bokuto testnet
bun run start:anvil bokuto

# Or fork Katana mainnet
bun run start:anvil katana
```

#### Terminal 2: Verify the Fork

To check if all is well, you can run the following command in another terminal.

```sh
bun run verify:anvil
```

This will automatically detect which chain you're forking and verify that
contracts are accessible. It will test key contracts (like AUSD, WETH,
MorphoBlue) if available on the forked chain and show connection details for
your wallet.

See [scripts/README.md](scripts/README.md) for more details.

### 4️⃣ **Example dApp**

The starter kit includes a simple example dApp that connects to the Tatara
testnet (or your local fork) and displays information about key contracts.

To run the example:

1. Start your local chain fork (in its own terminal):

   ```sh
   # Fork Tatara testnet
   bun run start:anvil tatara
   ```

2. In a new terminal, build the dApp:

   ```sh
   bun run build
   ```

3. Serve `dist/index.html` in your browser with something like
   `cd dist && npx http-server`

The example dApp shows:

- AUSD token information
- WETH token information
- MorphoBlue protocol information

You can use this as a starting point for your own dApp development.

### 5️⃣ **Using the Foundry MCP Server**

The kit includes a Foundry MCP (Model Context Protocol) server that enables
AI-assisted smart contract and app development when used with compatible AI
tools like Cursor.

To use the MCP server:

1. Configure e.g. Cursor to use the MCP server by adding the following to your Cursor
   config in `.cursor/mcp.json`:

   ```json
   "mcpServers": {
     "foundry": {
       "command": "bun run",
       "args": [
         "/absolute_path_to_starter_kit/dist-mcp/index.js"
       ],
       "env": {
         "PRIVATE_KEY": "0xYourPrivateKeyHere",
         "RPC_URL": "http://localhost:8545"
       }
     }
   }
   ```

   Replace `/absolute_path_to_starter_kit/` with absolute path to your clone of
   the starter kit.

2. Launch the local chain with `bun run start:anvil tatara` (or `bokuto`/`katana`).

3. The `PRIVATE_KEY` and `RPC_URL` environment variables are optional. If not
   provided, the RPC URL will default to `http://localhost:8545`.

4. After configuring, you can use the AI in Cursor to interact with Foundry
   tools, including:
   - Calling contract functions
   - Checking balances
   - Starting/stopping Anvil instances
   - Creating and deploying smart contracts
   - Working with Katana-specific contracts

The MCP server provides a seamless interface between AI tools and Foundry's
blockchain development toolkit, making it easier to build and interact with
contracts on Katana.

### 6️⃣ **Contract Address Mapping**

The kit includes a utility to generate a JavaScript mapping of all contract
addresses for both Tatara testnet and Katana mainnet (when available). This
makes it easy to access contract addresses in your frontend code without
hardcoding them.

To generate the address mapping:

```sh
bun run build:addressutils
```

This will create files in `utils/addresses/`:

- `mapping.ts` - Auto-generated mapping of contract addresses (do not edit)
- `index.ts` - User-friendly API wrapper with chain context management

### Usage

The improved API provides a cleaner interface with automatic "I" prefix handling:

```javascript
import { addresses, CHAINS } from '../utils/addresses';

// Set the chain context (by name or ID)
addresses.setChain('tatara');
// or
addresses.setChain(CHAINS.tatara);

// Get contract addresses - automatically handles I prefix
const wethAddress = addresses.getAddress('WETH');      // Finds IWETH
const morphoAddress = addresses.getAddress('MorphoBlue'); // Finds IMorphoBlue
const ausdAddress = addresses.getAddress('AUSD');      // Finds IAUSD

// Check if a contract exists
if (addresses.hasContract('Permit2')) {
  const permit2 = addresses.getAddress('Permit2');
}

// Get all available contracts on current chain
const allContracts = addresses.getAllContracts();

// Get address for a specific chain without changing context
const wethOnKatana = addresses.getAddressForChain('WETH', 'katana');
```

### Features

- **Automatic I-prefix handling**: Try `WETH` and it will find `IWETH`
- **Chain context management**: Set once, use everywhere
- **Better error messages**: Shows available contracts when not found
- **Type-safe**: Full TypeScript support with address types

The address mapping is generated from the `@custom:tatara`, `@custom:katana`, and
`@custom:bokuto` doccomments in the contract files.

---

## 🔗 Smart Contract Development

See [interfaces](interfaces).

---

## 📜 Example Integration (Coming Soon)

Once the **example contracts** are added, you'll have:

- ERC-20 & ERC-4626 **yield strategies**
- **Cross-chain bridging scripts**
- **Contract interactions with AggLayer**
- **Example UI for wallet connection & swaps**

---

## 🛠 Contributing

We welcome contributions! If you'd like to improve the Katana Starter Kit, fork
the repo and submit a PR.

---

3️⃣ Deploy and interact with Katana's **DeFi money legos**

🚀 **Happy Building!**
