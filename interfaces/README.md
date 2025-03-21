# Katana Contract Interfaces

This repository contains Solidity interfaces for all core contracts deployed on
Katana.

## Network-aware Contract Addresses

All interfaces in this repository include the deployed contract addresses for
the Tatara testnet. For code that needs to work across both testnet and mainnet
environments, we provide the `KatanaAddresses` library:

- **[KatanaAddresses](./utils/KatanaAddresses.sol)** - Utility library that
  dynamically resolves contract addresses based on the current network
  (`block.chainid`). This allows your code to work seamlessly on both Tatara
  testnet and Katana mainnet without hard-coding network-specific addresses.

Example usage:

```solidity
// Import both the interface and the address resolver
import "@katana/interfaces/ISeaport.sol";
import "@katana/interfaces/utils/KatanaAddresses.sol";

contract MyDapp {
    function executeSeaportFunction() external {
        // Get the correct Seaport address for the current network
        address seaportAddress = KatanaAddresses.getSeaportAddress();
        
        // Instantiate the interface with the network-appropriate address
        ISeaport seaport = ISeaport(seaportAddress);
        
        // Use the interface normally...
        // seaport.fulfillOrder(...);
    }
}
```

As Katana mainnet launches, the `KatanaAddresses` library will be updated with
mainnet addresses, allowing your code to work across environments without
changes.

## Interface Categories

The interfaces in this folder are designed to make it easy to connect different
"money legos" on Katana.

## Core Interfaces

Below are the key interfaces available for interacting with Katana's core infrastructure:

### Bridge and Cross-chain Communication

- TODO - lxly etc

### AggChain Core Contracts

- **[IPolygonZkEVMDeployer](./agglayer/IPolygonZkEVMDeployer.sol)** - Main
  deployer contract for AggChain (Polygon's ZkEVM) components. Manages the
  deployment and initialization of rollup infrastructure with configurable
  parameters including chain ID, gas token settings, and verifier addresses.
  Address: `0x36810012486fc134D0679c07f85fe5ba5A087D8C`

- **[IProxyAdmin](./agglayer/IProxyAdmin.sol)** - Admin contract for managing
  transparent proxies in the AggChain architecture. Provides functions to
  upgrade proxy implementations, change proxy admins, and manage ownership.
  Essential for controlled upgrades of core infrastructure contracts. Address:
  `0x85cEB41028B1a5ED2b88E395145344837308b251`

- **[IBridgeL2SovereignChain](./agglayer/IBridgeL2SovereignChain.sol)** - Bridge
  contract for cross-chain communication between Layer 1 and Layer 2. Enables
  bridging of assets and arbitrary messages across chains with comprehensive
  verification mechanisms. Implementation:
  `0x8BD36ca1A55e389335004872aA3C3Be0969D3aA7`, Proxy:
  `0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582`

-
  **[IGlobalExitRootManagerL2SovereignChain](./agglayer/IGlobalExitRootManagerL2SovereignChain.sol)**
  - Manages exit roots across chains, essential for secure cross-chain
  withdrawals. Maintains a history of global exit roots and their timestamps for
  verification purposes. Implementation:
  `0x282a631D9F3Ef04Bf1A44B4C9e8bDC8EB278917f`, Proxy:
  `0xa40d5f56745a118d0906a34e69aec8c0db1cb8fa`

- **[IPolygonZkEVMTimelock](./agglayer/IPolygonZkEVMTimelock.sol)** - Governance
  timelock contract that enforces delays for administrative actions. Provides
  scheduling, execution, and cancellation of governance operations with granular
  permission controls for proposers and executors. Address:
  `0xdbC6981a11fc2B000c635bFA7C47676b25C87D39`

### Multisig and Security

- **[IGnosisSafe](./IGnosisSafe.sol)** - Gnosis Safe multisignature wallet for
  secure asset management and transaction execution requiring multiple
  signatures. Address: `0x69f4D1788e39c87893C980c06EdF4b7f686e2938`

- **[IGnosisSafeL2](./IGnosisSafeL2.sol)** - Layer 2 optimized version of Gnosis
  Safe with additional events for better indexing and gas optimizations.
  Address: `0xfb1bffC9d739B8D520DaF37dF666da4C687191EA`

- **[IMultiSend](./IMultiSend.sol)** - Utility that batches multiple
  transactions into a single transaction. Supports both call and delegatecall
  operations. Address: `0x998739BFdAAdde7C933B942a68053933098f9EDa`

- **[IMultiSendCallOnly](./IMultiSendCallOnly.sol)** - Safer version of
  MultiSend that only allows regular call operations (no delegatecall). Address:
  `0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B`

### Deployment Utilities

- **[IDeterministicDeploymentProxy](./IDeterministicDeploymentProxy.sol)** -
  Arachnid's proxy for deploying contracts at the same address across different
  EVM chains. Address: `0x4e59b44847b379578588920cA78FbF26c0B4956C` or `0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7`

- **[ICreate2Deployer](./ICreate2Deployer.sol)** - Advanced CREATE2 deployment
  tool with additional safety features, address computation utilities, and
  pausability. Complementary to the Deterministic Deployment Proxy.
  Address: `0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2`

- **[ICreateX](./ICreateX.sol)** - The most comprehensive contract deployment
  factory, supporting CREATE, CREATE2, and CREATE3 patterns with advanced features
  like initialization calls, proxying, and address computation. Ideal for complex
  deployment workflows and cross-chain applications.
  Address: `0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed`

### Tokens and Assets

- **[IAUSD](./tokens/IAUSD.sol)** - Agora USD (AUSD), the native stablecoin on
  Katana. Implements the standard ERC-20 interface for seamless integration with
  DeFi protocols and applications. AUSD is designed to maintain a stable value
  and serve as a medium of exchange within the Katana ecosystem. Address:
  `0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC`

### Vault Bridge Contracts

- **[IWETH](./vb/IWETH.sol)** - Wrapped Ether (WETH) token on Katana, which
  wraps native ETH into an ERC-20 compatible token. Provides standard methods
  for depositing ETH to mint WETH and withdrawing ETH by burning WETH, enabling
  ETH to be used in applications requiring ERC-20 token interfaces.
  Address: `0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4`

- **[IWETHNativeConverter](./vb/IWETHNativeConverter.sol)** - Utility contract
  for seamless conversion between WETH and native ETH. Simplifies integration
  with applications that need to handle both token formats by providing helper
  functions for wrapping, unwrapping, and estimating conversion amounts.
  Address: `0x3aFbD158CF7B1E6BE4dAC88bC173FA65EBDf2EcD`

- **[IYieldExposedToken](./vb/IYieldExposedToken.sol)** - Base interface for
  yield-bearing tokens that combine ERC20 functionality with yield-generation
  mechanisms like ERC4626. These tokens use yield vaults to generate returns on
  their underlying assets while maintaining standard token interfaces.

- **[INativeConverter](./vb/INativeConverter.sol)** - Base interface for native
  converter contracts that handle conversion between native tokens and their
  yield-exposed versions, with cross-chain migration capabilities between Layer
  X and Layer Y.

#### Yield-Bearing Tokens

- **[IybUSDC](./vb/tokens/IybUSDC.sol)** - Yield-bearing USDC token on Sepolia
  that generates yield from USDC deposits while maintaining the ERC20 interface.
  Includes yield management functions and configurable reserve requirements.
  Address: `0xd8A986AFbB7e44e9F7D71cc529d7b28F7084028c`

- **[IybUSDT](./vb/tokens/IybUSDT.sol)** - Yield-bearing USDT token on Sepolia
  that generates yield from USDT deposits while maintaining the ERC20 interface.
  Features balanced reserve management and yield distribution mechanisms.
  Address: `0xf5a675058bbd344a9f1Ab1AF00576Dfb404D57b2`

- **[IybWBTC](./vb/tokens/IybWBTC.sol)** - Yield-bearing WBTC token on Sepolia
  that generates yield from WBTC deposits while maintaining the ERC20 interface.
  Provides Bitcoin exposure with yield generation capabilities. Address:
  `0x9954f137ce70db2afEA291dfcE742b14d1535110`

- **[IybDAI](./vb/tokens/IybDAI.sol)** - Yield-bearing DAI token on Sepolia that
  generates yield from DAI deposits while maintaining the ERC20 interface.
  Features automated yield harvesting and reserve management. Address:
  `0x106cbB7361c3D3D0a12A8160a714879CC13C5a29`

#### Native Converters

- **[IUSDCNativeConverter](./vb/converters/IUSDCNativeConverter.sol)** -
  Converter for USDC on Tatara that handles conversion between USDC and its
  yield-exposed version. Provides migration capabilities between Layer X and
  Layer Y with configurable parameters for backing reserves. Address:
  `0xC4BaBEE541c2FA1EA55ce9aF9EB3B5C76B0CE5c7`

- **[IUSDTNativeConverter](./vb/converters/IUSDTNativeConverter.sol)** -
  Converter for USDT on Tatara that handles conversion between USDT and its
  yield-exposed version. Features cross-chain migration capabilities with safety
  mechanisms for reserve management. Address:
  `0xB69b7196F8fa4d531452d31B82e8068110cB82d4`

- **[IWBTCNativeConverter](./vb/converters/IWBTCNativeConverter.sol)** -
  Converter for WBTC on Tatara that handles conversion between WBTC and its
  yield-exposed version. Provides secure migration of backing reserves between
  chains. Address: `0xB567390378c304E65139a60D44886F7B0150bBC0`

- **[IDAINativeConverter](./vb/converters/IDAINativeConverter.sol)** - Converter
  for DAI on Tatara that handles conversion between DAI and its yield-exposed
  version. Includes efficient conversion methods and migration capabilities.
  Address: `0x6a99f2004044357A80E5D43345229179adc871D4`

### NFT and Marketplaces

- **[ISeaport](./ISeaport.sol)** - OpenSea's marketplace protocol for safely and
  efficiently trading NFTs. Supports diverse order types, collection offers,
  efficient fulfillments, and advanced features like hooks and criteria-based
  orders. The definitive NFT marketplace protocol for Katana. Address:
  `0x0000000000FFe8B47B3e2130213B802212439497`

- **[IConduitController](./IConduitController.sol)** - OpenSea's Conduit
  Controller that manages the deployment and configuration of Conduits. Allows
  token owners to create secure transfer pathways for approved applications
  without needing to approve individual marketplaces. Critical infrastructure
  for secure token transfers in Seaport-based marketplaces. Address:
  `0x00000000F9490004C11Cef243f5400493c00Ad63`

- **[IConduit](./IConduit.sol)** - Interfaces for OpenSea's Conduit contracts,
  which enable the efficient transfer of approved ERC20/721/1155 tokens.
  Conduits act as transfer agents that can only be used by authorized channels,
  providing a safer way to manage token approvals across multiple applications.

### DeFi Protocols

- **[ISushiRouter](./ISushiRouter.sol)** - SushiSwap's specialized router for
  efficient token swaps. Features direct and batch swapping capabilities with
  flexible execution options, optimized for gas efficiency and minimal slippage.
  Suitable for both simple token exchanges and complex multi-token or multi-path
  trading strategies. Address: `0xAC4c6e212A361c968F1725b4d055b47E63F80b75`

- **[IMorphoBlue](./IMorphoBlue.sol)** - Morpho Labs' lending protocol that
  offers efficient and flexible isolated lending markets. Supports creating
  customizable markets with configurable parameters like collateral types,
  interest rate models, and oracles. Features include supplying/borrowing
  assets, using collateral, liquidations, flash loans, and delegated operations
  via signatures. Address: `0xC263190b99ceb7e2b7409059D24CB573e3bB9021`

- **[IMorphoIRM](./IMorphoIRM.sol)** - Morpho's interest rate model interface
  that calculates dynamic borrow rates based on market conditions. The adaptive
  IRM implementation adjusts rates based on supply and demand, optimizing
  capital efficiency. Address: `0x9eB6d0D85FCc07Bf34D69913031ade9E16BD5dB0`

- **[IMorphoAdaptiveIRM](./IMorphoAdaptiveIRM.sol)** - Morpho's advanced
  interest rate model that uses an adaptive curve algorithm to optimize rates
  based on market utilization. The model dynamically adjusts the interest rate
  curve to balance supply and demand, promoting market equilibrium. This
  sophisticated IRM is designed to enhance capital efficiency in Morpho Blue
  markets. Address: `0x9eB6d0D85FCc07Bf34D69913031ade9E16BD5dB0`

- **[IMetaMorphoFactory](./IMetaMorphoFactory.sol)** - Factory contract for
  creating MetaMorpho vaults, which are ERC-4626 compliant yield aggregators
  that allocate funds across multiple Morpho Blue markets. The factory
  simplifies deployment of new vaults with customizable parameters including
  owner, timelock periods, and underlying assets. Address:
  `0x505619071bdCDeA154f164b323B6C42Fc14257f7`

- **[IMetaMorpho](./IMetaMorpho.sol)** - Interface for MetaMorpho vaults, which
  are ERC-4626 tokenized vaults that strategically allocate funds across
  multiple Morpho Blue lending markets. These vaults feature dynamic
  reallocation capabilities, market-specific caps, and customizable
  deposit/withdraw strategies managed by curators. MetaMorpho vaults
  automatically optimize for yield while maintaining a configurable risk profile
  managed through governance.

- **[IBundler3](./IBundler3.sol)** - Advanced multicall utility that enables
  batching multiple contract calls into a single transaction. Unlike standard
  multicall contracts, Bundler3 supports complex interaction patterns including
  reentrant callbacks, ETH value transfers, and selective error handling. The
  contract stores the transaction initiator, making it useful for protocols that
  need to identify the original caller across multiple contract interactions.
  Address: `0xD0bDf3E62F6750Bd83A50b4001743898Af287009`

- **[IPublicAllocator](./IPublicAllocator.sol)** - Enables permissionless
  reallocation of MetaMorpho vaults through a bounded, fee-paying interface.
  This contract allows anyone to rebalance funds between markets within
  administrator-defined flow caps, optimizing capital utilization without
  requiring governance actions. The Public Allocator creates a market-driven
  approach to capital allocation while maintaining security through configurable
  constraints and fee incentives. Address:
  `0x8FfD3815919081bDb60CD8079C68444331B65042`

- **[IPreLiquidationFactory](./IPreLiquidationFactory.sol)** - Factory contract
  for creating pre-liquidation contracts tailored to specific Morpho Blue
  markets. These pre-liquidation contracts enable safety-focused early
  liquidations for positions that are approaching unhealthy LTV ratios but
  haven't yet reached the liquidation threshold.

- **[IPreLiquidation](./IPreLiquidation.sol)** - Implements an
  early-intervention liquidation mechanism that allows positions to be partially
  liquidated before they reach Morpho's liquidation threshold but after crossing
  a configurable pre-liquidation threshold. Features linear scaling of both
  incentives and maximum liquidatable amounts based on position health,
  providing a more capital-efficient approach to managing risk in lending
  markets.

- **[IPreLiquidationCallback](./IPreLiquidationCallback.sol)** - Callback
  interface for pre-liquidation integrators that enables complex liquidation
  strategies by providing notification when pre-liquidations are executed.

- **[IMorphoOracle](./IMorphoOracle.sol)** - Oracle interface used by Morpho
  Blue to price collateral assets against loan assets. Essential component for
  calculating health factors and liquidation thresholds in lending markets.

- **[IMorphoChainlinkOracleV2Factory](./IMorphoChainlinkOracleV2Factory.sol)** -
  Factory contract for creating Chainlink-based price oracles for Morpho Blue
  markets. Supports complex oracle configurations that can combine multiple
  Chainlink price feeds and ERC4626 vault token conversions to calculate
  accurate collateral-to-loan asset price ratios. Essential for creating markets
  with wrapped or yield-bearing tokens as collateral or loan assets. Address:
  `0xe795DD345aD7E1bC9e8F6B4437a21704d731F9E0`

- **[IMorphoChainlinkOracleV2](./IMorphoChainlinkOracleV2.sol)** -
  Implementation of Morpho's oracle interface that uses Chainlink price feeds.
  Can handle direct token prices or compositions of multiple price feeds and
  ERC4626 vault conversions to determine accurate price ratios between
  collateral and loan assets.

- **[IMorphoCallbacks](./IMorphoCallbacks.sol)** - Collection of callback
  interfaces that integrators can implement to interact with Morpho Blue's key
  operations including supply, borrow, repay, liquidation, and flash loan
  functions.

### Utility Contracts

- **[IMulticall3](./IMulticall3.sol)** - Contract that allows batching multiple
  read-only calls into a single transaction. Improves dapp performance and UX by
  reducing RPC requests. Includes functions from Multicall1, Multicall2, and
  adds new features like per-call failure flags and value transfer. Address:
  `0xcA11bde05977b3631167028862bE2a173976CA11`

- **[IBatchDistributor](./IBatchDistributor.sol)** - Utility for batch distributing
  ETH and ERC-20 tokens to multiple addresses in a gas-efficient manner.
  Perfect for airdrops, reward distributions, payroll, and other bulk transfer scenarios.
  Address: `0x36C38895A20c835F9A6A294821D669995eB2265E`

- **[IPermit2](./IPermit2.sol)** - Uniswap's next-generation token
  approval/transfer system that enhances safety and UX by allowing
  signature-based token transfers and approvals. Features include approval
  expiration, batch operations, and gas optimizations. Used by many DeFi
  protocols to improve token authorization workflows. Address:
  `0x000000000022D473030F116dDEE9F6B43aC78BA3`

- **[IRIP7212](./IRIP7212.sol)** - Precompile for efficient verification of
  secp256r1 (P-256) curve signatures, commonly used in secure enclaves (Apple
  Secure Enclave, Android TEE). Enables native biometric authentication support
  for smart accounts with dramatic gas savings. Address:
  `0x0000000000000000000000000000000000000100`

## ERC-4337 Account Abstraction Interfaces

These interfaces provide support for the ERC-4337 Account Abstraction standard.

### Common Components

**[IERC4337.sol](./IERC4337.sol)**  
Common interfaces and structures used across both v0.6.0 and v0.7.0 of the
ERC-4337 standard, including `IStakeManager` and `INonceManager`.

### v0.6.0 Implementation

**[v0.6.0/IEntryPoint.sol](./v0.6.0/IEntryPoint.sol)**  
Interface for the EntryPoint v0.6.0, which is the primary contract responsible
for handling user operations.

- **Address**: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
- Contains interfaces for IAggregator and IPaymaster

**[v0.6.0/IERC4337Account.sol](./v0.6.0/IERC4337Account.sol)**  
Interface for ERC-4337 compatible accounts for v0.6.0, including the
UserOperation struct.

**[v0.6.0/ISenderCreator.sol](./v0.6.0/ISenderCreator.sol)**  
Interface for the SenderCreator helper contract used in v0.6.0 to create new
account contracts.

- **Address**: `0x7fc98430eaedbb6070b35b39d798725049088348`

### v0.7.0 Implementation

**[v0.7.0/IEntryPoint.sol](./v0.7.0/IEntryPoint.sol)**  
Interface for the EntryPoint v0.7.0, which is the primary contract responsible
for handling user operations.

- **Address**: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`
- Contains interfaces for IAggregator and IPaymaster

**[v0.7.0/IEntryPointSimulations.sol](./v0.7.0/IEntryPointSimulations.sol)**  
Extended simulation interface for EntryPoint v0.7.0 that provides detailed
simulation capabilities.

- **Address**: `0x0000000071727De22E5E9d8BAf0edAc6f37da032` (same as EntryPoint)

**[v0.7.0/IERC4337Account.sol](./v0.7.0/IERC4337Account.sol)**  
Interface for ERC-4337 compatible accounts for v0.7.0, including the
PackedUserOperation struct.

**[v0.7.0/ISenderCreator.sol](./v0.7.0/ISenderCreator.sol)**  
Interface for the SenderCreator helper contract used in v0.7.0 to create new
account contracts.

- **Address**: `0x00000000FC04c59277B65Bc2AC8c843392C3ca4c`

## How to Use These Interfaces

To interact with these contracts in your own project:

1. Import the desired interface into your Solidity file:

   ```solidity
   import "@katana/interfaces/IWETH.sol";
   ```

2. Create an instance of the contract using the interface and address:

   ```solidity
   IWETH weth = IWETH(0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4);
   ```

3. Call functions on the contract:

   ```solidity
   weth.deposit{value: 1 ether}();
   ```

## Examples

Check out our example contracts in the `/examples` folder to see how to use
these interfaces in your own contracts.

### Yearn Contracts

- **[IYearnVault](./yearn/IYearnVault.sol)** - Base interface for Yearn Finance
  ERC4626-compatible vaults, which extend the ERC20 standard with tokenized
  vault shares. Includes full ERC4626 functionality plus Yearn-specific features
  like strategy management, fee configuration, and performance metrics.

- **[IYvAUSD](./yearn/IYvAUSD.sol)** - Interface for the Yearn AUSD vault, which
  accepts AUSD deposits and issues yvAUSD tokens. Provides yield-generating
  capabilities for AUSD holdings with additional controls for deposit limits,
  emergency shutdown, and fee management. Address:
  `0xAe4b2FCf45566893Ee5009BA36792D5078e4AD60`

- **[IYvWETH](./yearn/IYvWETH.sol)** - Interface for the Yearn WETH vault, which
  accepts WETH deposits and issues yvWETH tokens. Offers yield generation on ETH
  (through WETH) with features for managing deposit limits, strategy
  withdrawals, and fee configuration. Address:
  `0xccc0fc2e34428120f985b460b487eb79e3c6fa57`
