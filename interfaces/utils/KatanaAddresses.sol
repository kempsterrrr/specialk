// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title KatanaAddresses
 * @notice Library for dynamically resolving contract addresses based on the current network
 * @dev Uses block.chainid to determine whether code is running on mainnet or testnet
 */
library KatanaAddresses {
    /**
     * @notice Chain ID for Katana Tatara testnet
     */
    uint256 internal constant TATARA_CHAIN_ID = 471;  // Adjust this if the actual chain ID is different

    /**
     * @notice Chain ID for Katana mainnet (TBD)
     */
    uint256 internal constant KATANA_MAINNET_CHAIN_ID = 0;  // Update when mainnet chain ID is known

    /**
     * @notice Returns the current network type
     * @return true if running on mainnet, false if on testnet
     */
    function isMainnet() internal view returns (bool) {
        return block.chainid == KATANA_MAINNET_CHAIN_ID;
    }

    /**
     * @notice Returns the address of the Seaport marketplace contract
     * @return The address of Seaport for the current network
     */
    function getSeaportAddress() internal view returns (address) {
        if (isMainnet()) {
            // Return mainnet address when it's available
            return address(0); // Replace with actual mainnet address when deployed
        } else {
            // Return Tatara testnet address
            return 0x0000000000FFe8B47B3e2130213B802212439497;
        }
    }

    /**
     * @notice Returns the address of the Morpho Blue contract
     * @return The address of Morpho Blue for the current network
     */
    function getMorphoBlueAddress() internal view returns (address) {
        if (isMainnet()) {
            // Return mainnet address when it's available
            return address(0); // Replace with actual mainnet address when deployed
        } else {
            // Return Tatara testnet address
            return 0xC263190b99ceb7e2b7409059D24CB573e3bB9021;
        }
    }

    /**
     * @notice Returns the address of the WETH token contract
     * @return The address of WETH for the current network
     */
    function getWETHAddress() internal view returns (address) {
        if (isMainnet()) {
            // Return mainnet address when it's available
            return address(0); // Replace with actual mainnet address when deployed
        } else {
            // Return Tatara testnet address
            return 0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4;
        }
    }

    // Add more getters for other contracts as needed
    // This file will be expanded as more mainnet addresses become available
} 