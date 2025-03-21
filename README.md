# Katana Development Starter Kit

## 🚀 Introduction

Welcome to the **Katana Development Starter Kit**! This repository serves as
your launchpad for building on **Katana** and its testnet **Tatara**.

This kit provides:

- **Deno-based development environment** 🦕
- **Pre-configured build system** using Esbuild & TypeScript
- **Example contracts** to help you integrate with **Katana’s money legos** and
  interfaces for all deployed contracts on Katana and Tatara
- **Foundry setup** for smart contract development and testing

Whether you're building **yield strategies, cross-chain intent-based execution,
or novel DeFi protocols**, this starter kit helps you bootstrap your project
**fast**.

---

## 📦 What's Included

- **Simple Unopinionated Deno Build System** (see `build.ts`)
- **Example Smart Contracts** (coming soon)
- **Standard Interfaces & ABIs** for interacting with Katana primitives
- **Static File Handling** (HTML, CSS, and assets copied to `dist/`, easy to
  host on IPFS or any static file hosting service)

---

## 🛠 Setup & Installation

### 1️⃣ **Install Dependencies**

Ensure you have the required tools installed:

- [Deno](https://deno.land/) `2+`
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

---

## 🔗 Smart Contract Development

See [interfaces](interfaces).

---

## 📜 Example Integration (Coming Soon)

Once the **example contracts** are added, you’ll have:

- ERC-20 & ERC-4626 **yield strategies**
- **Cross-chain bridging scripts**
- **Contract interactions with AggLayer**
- **Example UI for wallet connection & swaps**

---

## 🛠 Contributing

We welcome contributions! If you’d like to improve the Katana Starter Kit, fork
the repo and submit a PR.

---

3️⃣ Deploy and interact with Katana’s **DeFi money legos**

🚀 **Happy Building!**
