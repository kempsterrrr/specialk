# Katana Development Starter Kit

![Box of legos](leo.jpg)

## 🚀 Introduction

Welcome to the **Katana Development Starter Kit**! This repository serves as
your launchpad for building on **Katana** and its testnet **Tatara**.

This kit provides:

- **Deno-based development environment** 🦕
- **Bun support** for local chain forks and development 🧅
- **Pre-configured build system** using Esbuild & TypeScript
- **[UI-kit CSS](https://getuikit.com/)**, optional to use
- **[viem](https://viem.sh/)** for blockchain interactions
- **Example contracts** to help you integrate with **Katana's money legos** and
  interfaces for all deployed contracts on Katana and Tatara
- **Foundry setup** for smart contract development and testing
- **Static File Handling** (HTML, CSS, and assets copied to `dist/`, easy to
  host on IPFS or any static file hosting service)
- **[TEVM](https://tevm.sh/) support** for local development with forked Tatara state

Whether you're building **yield strategies, cross-chain intent-based execution,
or novel DeFi protocols**, this starter kit helps you bootstrap your project
**fast**.

---

## 🛠 Setup & Installation

### 1️⃣ **Install Dependencies**

Copy `.env.example` into `.env` and add in your RPC endpoints.

Ensure you have the required tools installed:

- [Deno](https://deno.land/) `2+` or [Bun](https://bun.sh/)
- [Foundry](https://book.getfoundry.sh/) for contract development
- [Git](https://git-scm.com/)

### 2️⃣ **Run the Build System**

This project uses **Deno** as its runtime and **Esbuild** for bundling. To build
your project, run:

```sh
deno run build
```

This will:

- Compile and minify your TypeScript code
- Copy HTML & static assets to `./dist`
- Prepare the environment for deployment

### 3️⃣ **Local Chain Forking**

For local development with a Tatara testnet fork, you have two options:

#### Using Bun (Recommended)

```sh
# Install dependencies
bun install

# Start local Tatara fork
bun run fork:tatara
```

This will create a local fork of Tatara and start an RPC server at http://localhost:8545 that you can connect to with MetaMask (Chain ID: 471).

#### Using Deno

```sh
deno task tevm:tatara
```

See [scripts/README.md](scripts/README.md) for more details on both methods.

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
