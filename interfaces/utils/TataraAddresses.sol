// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TataraAddresses
 * @notice Library for accessing Tatara testnet contract addresses
 * @dev Extracted from project documentation for easy access to deployed contracts
 */
library TataraAddresses {
    // AggChain Core Contracts
    function getPolygonZkEVMDeployerAddress() internal pure returns (address) {
        return 0x36810012486fc134D0679c07f85fe5ba5A087D8C;
    }

    function getProxyAdminAddress() internal pure returns (address) {
        return 0x85cEB41028B1a5ED2b88E395145344837308b251;
    }

    function getBridgeL2SovereignChainAddress() internal pure returns (address) {
        return 0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582; // Proxy address
    }

    function getBridgeL2SovereignChainImplementationAddress() internal pure returns (address) {
        return 0x8BD36ca1A55e389335004872aA3C3Be0969D3aA7; // Implementation address
    }

    function getGlobalExitRootManagerL2SovereignChainAddress() internal pure returns (address) {
        return 0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA; // Proxy address (fixed checksum)
    }

    function getGlobalExitRootManagerL2SovereignChainImplementationAddress() internal pure returns (address) {
        return 0x282a631D9F3Ef04Bf1A44B4C9e8bDC8EB278917f; // Implementation address
    }

    function getPolygonZkEVMTimelockAddress() internal pure returns (address) {
        return 0xdbC6981a11fc2B000c635bFA7C47676b25C87D39;
    }

    // Multisig and Security
    function getGnosisSafeAddress() internal pure returns (address) {
        return 0x69f4D1788e39c87893C980c06EdF4b7f686e2938;
    }

    function getGnosisSafeL2Address() internal pure returns (address) {
        return 0xfb1bffC9d739B8D520DaF37dF666da4C687191EA;
    }

    function getMultiSendAddress() internal pure returns (address) {
        return 0x998739BFdAAdde7C933B942a68053933098f9EDa;
    }

    function getMultiSendCallOnlyAddress() internal pure returns (address) {
        return 0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B;
    }

    // Deployment Utilities
    function getDeterministicDeploymentProxyAddress() internal pure returns (address) {
        return 0x4e59b44847b379578588920cA78FbF26c0B4956C; // Alternative: 0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7
    }

    function getCreate2DeployerAddress() internal pure returns (address) {
        return 0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2;
    }

    function getCreateXAddress() internal pure returns (address) {
        return 0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed;
    }

    // Tokens and Assets
    function getAUSDAddress() internal pure returns (address) {
        return 0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC;
    }

    // Vault Bridge Contracts
    function getWETHAddress() internal pure returns (address) {
        return 0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4;
    }

    function getWETHNativeConverterAddress() internal pure returns (address) {
        return 0x3aFbD158CF7B1E6BE4dAC88bC173FA65EBDf2EcD;
    }

    // Yield-Bearing Tokens
    function getybUSDCAddress() internal pure returns (address) {
        return 0xd8A986AFbB7e44e9F7D71cc529d7b28F7084028c;
    }

    function getybUSDTAddress() internal pure returns (address) {
        return 0xf5a675058bbd344a9f1Ab1AF00576Dfb404D57b2;
    }

    function getybWBTCAddress() internal pure returns (address) {
        return 0x9954f137ce70db2afEA291dfcE742b14d1535110;
    }

    function getybDAIAddress() internal pure returns (address) {
        return 0x106cbB7361c3D3D0a12A8160a714879CC13C5a29;
    }

    // Native Converters
    function getUSDCNativeConverterAddress() internal pure returns (address) {
        return 0xC4BaBEE541c2FA1EA55ce9aF9EB3B5C76B0CE5c7;
    }

    function getUSDTNativeConverterAddress() internal pure returns (address) {
        return 0xB69b7196F8fa4d531452d31B82e8068110cB82d4;
    }

    function getWBTCNativeConverterAddress() internal pure returns (address) {
        return 0xB567390378c304E65139a60D44886F7B0150bBC0;
    }

    function getDAINativeConverterAddress() internal pure returns (address) {
        return 0x6a99f2004044357A80E5D43345229179adc871D4;
    }

    // NFT and Marketplaces
    function getSeaportAddress() internal pure returns (address) {
        return 0x0000000000FFe8B47B3e2130213B802212439497;
    }

    function getConduitControllerAddress() internal pure returns (address) {
        return 0x00000000F9490004C11Cef243f5400493c00Ad63;
    }

    // DeFi Protocols
    function getSushiRouterAddress() internal pure returns (address) {
        return 0xAC4c6e212A361c968F1725b4d055b47E63F80b75;
    }

    function getMorphoBlueAddress() internal pure returns (address) {
        return 0xC263190b99ceb7e2b7409059D24CB573e3bB9021;
    }

    function getMorphoIRMAddress() internal pure returns (address) {
        return 0x9eB6d0D85FCc07Bf34D69913031ade9E16BD5dB0;
    }

    function getMorphoAdaptiveIRMAddress() internal pure returns (address) {
        return 0x9eB6d0D85FCc07Bf34D69913031ade9E16BD5dB0; // Same as MorphoIRM
    }

    function getMetaMorphoFactoryAddress() internal pure returns (address) {
        return 0x505619071bdCDeA154f164b323B6C42Fc14257f7;
    }

    function getBundler3Address() internal pure returns (address) {
        return 0xD0bDf3E62F6750Bd83A50b4001743898Af287009;
    }

    function getPublicAllocatorAddress() internal pure returns (address) {
        return 0x8FfD3815919081bDb60CD8079C68444331B65042;
    }

    function getMorphoChainlinkOracleV2FactoryAddress() internal pure returns (address) {
        return 0xe795DD345aD7E1bC9e8F6B4437a21704d731F9E0;
    }

    // Utility Contracts
    function getMulticall3Address() internal pure returns (address) {
        return 0xcA11bde05977b3631167028862bE2a173976CA11;
    }

    function getBatchDistributorAddress() internal pure returns (address) {
        return 0x36C38895A20c835F9A6A294821D669995eB2265E;
    }

    function getPermit2Address() internal pure returns (address) {
        return 0x000000000022D473030F116dDEE9F6B43aC78BA3;
    }

    function getRIP7212Address() internal pure returns (address) {
        return 0x0000000000000000000000000000000000000100;
    }

    // ERC-4337 Account Abstraction
    function getEntryPointV06Address() internal pure returns (address) {
        return 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;
    }

    function getSenderCreatorV06Address() internal pure returns (address) {
        return 0x7fc98430eAEdbb6070B35B39D798725049088348; // Fixed checksum
    }

    function getEntryPointV07Address() internal pure returns (address) {
        return 0x0000000071727De22E5E9d8BAf0edAc6f37da032;
    }

    function getEntryPointSimulationsV07Address() internal pure returns (address) {
        return 0x0000000071727De22E5E9d8BAf0edAc6f37da032; // Same as EntryPointV07
    }

    function getSenderCreatorV07Address() internal pure returns (address) {
        return 0x00000000FC04C59277B65Bc2aC8c843392C3ca4c; // Fixed checksum
    }

    // Yearn Contracts
    function getYvAUSDAddress() internal pure returns (address) {
        return 0xAe4b2FCf45566893Ee5009BA36792D5078e4AD60;
    }

    function getYvWETHAddress() internal pure returns (address) {
        return 0xccC0Fc2E34428120f985b460b487eB79E3C6FA57; // Fixed checksum
    }
} 