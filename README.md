# Katana Development Starter Kit

![Box of legos](leo.jpg)

## 🚀 Introduction

Welcome to the **Katana Development Starter Kit**! This repository serves as
your launchpad for building on **Katana** and its testnet **Tatara**.

This kit provides:

- **Bun-based development environment** 🧅
- **Anvil + Foundry integration** for reliable local chain forks
- **Pre-configured build system** using Esbuild & TypeScript
- **[UI-kit CSS](https://getuikit.com/)**, optional to use
- **[viem](https://viem.sh/)** for blockchain interactions
- **Example contracts** to help you integrate with **Katana's money legos** and
  interfaces for all deployed contracts on Katana and Tatara
- **Foundry setup** for smart contract development and testing
- **Static File Handling** (HTML, CSS, and assets copied to `dist/`, easy to
  host on IPFS or any static file hosting service)
- **Local blockchain forks** for development with real contract states
- Script to generate a single file contract directory with all the ABIs,
  contract names, paths, descriptions, addresses, and context they belong to,
  for directory browsers like the [contract dir](https://contractdir.bruno.id)

Whether you're building **yield strategies, cross-chain intent-based execution,
or novel DeFi protocols**, this starter kit helps you bootstrap your project
**fast**.

- [More about contract interfaces](/interfaces/README.md)
- [More about running Katana locally for development](/scripts/README.md)

---

## 🛠 Setup & Installation

### 1️⃣ **Install Dependencies**

Copy `.env.example` into `.env` and add in your RPC endpoints.

Ensure you have the required tools installed:

- [Bun](https://bun.sh/) - Follow the installation instructions at https://bun.sh/
- [Foundry](https://book.getfoundry.sh/) for contract development and local chain forks
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
bun run build
```

This will:

- Compile and minify your TypeScript code
- Copy HTML & static assets to `./dist`
- Prepare the environment for deployment

### 3️⃣ **Local Chain Forking**

For local development with a Tatara testnet fork, you'll need to run two
commands in separate terminals:

#### Terminal 1: Start Anvil Fork

```sh
bun run start:anvil:tatara
```

#### Terminal 2: Verify the Fork

```sh
bun run verify:anvil:tatara
```

This creates a local fork of Tatara at `http://localhost:8545` that you can
connect to with MetaMask (Chain ID: 471).

See [scripts/README.md](scripts/README.md) for more details.

### 4️⃣ **Example dApp**

The starter kit includes a simple example dApp that connects to the Tatara
testnet (or your local fork) and displays information about key contracts.

To run the example:

1. Start your local Tatara fork (in its own terminal):

   ```sh
   bun run start:anvil
   ```

2. In a new terminal, build the dApp:

   ```sh
   bun run build
   ```

3. Open `dist/index.html` in your browser

The example dApp shows:

- AUSD token information
- WETH token information
- MorphoBlue protocol information

You can use this as a starting point for your own dApp development.

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
