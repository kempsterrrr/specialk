// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title KatanaOriginAddresses
 * @notice Library for accessing origin chain contract addresses when operating in Katana context
 * @dev Auto-generated from contract doccomments. Do not edit manually.
 *      These are contracts deployed on origin chains (Ethereum/Sepolia) that are accessed
 *      from the Katana context for cross-chain operations like Vault Bridge.
 */
library KatanaOriginAddresses {
    /**
     * @notice Returns the origin chain address of IMigrationManager
     * @dev This contract is deployed on ethereum and accessed from Katana context
     * @return The IMigrationManager contract address on ethereum
     */
    function getMigrationManagerAddress() internal pure returns (address) {
        return 0x417d01B64Ea30C4E163873f3a1f77b727c689e02;
    }

    /**
     * @notice Returns the origin chain address of IvbETH
     * @dev This contract is deployed on ethereum and accessed from Katana context
     * @return The IvbETH contract address on ethereum
     */
    function getIvbETHAddress() internal pure returns (address) {
        return 0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF;
    }

    /**
     * @notice Returns the origin chain address of IvbUSDC
     * @dev This contract is deployed on ethereum and accessed from Katana context
     * @return The IvbUSDC contract address on ethereum
     */
    function getIvbUSDCAddress() internal pure returns (address) {
        return 0x53E82ABbb12638F09d9e624578ccB666217a765e;
    }

    /**
     * @notice Returns the origin chain address of IvbUSDS
     * @dev This contract is deployed on ethereum and accessed from Katana context
     * @return The IvbUSDS contract address on ethereum
     */
    function getIvbUSDSAddress() internal pure returns (address) {
        return 0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855;
    }

    /**
     * @notice Returns the origin chain address of IvbUSDT
     * @dev This contract is deployed on ethereum and accessed from Katana context
     * @return The IvbUSDT contract address on ethereum
     */
    function getIvbUSDTAddress() internal pure returns (address) {
        return 0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC;
    }

    /**
     * @notice Returns the origin chain address of IvbWBTC
     * @dev This contract is deployed on ethereum and accessed from Katana context
     * @return The IvbWBTC contract address on ethereum
     */
    function getIvbWBTCAddress() internal pure returns (address) {
        return 0x2C24B57e2CCd1f273045Af6A5f632504C432374F;
    }

}