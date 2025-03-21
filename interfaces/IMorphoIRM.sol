// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IMorphoIRM
 * @notice Interface for interest rate models used by Morpho Blue
 * @dev Morpho Blue uses this interface to calculate borrow rates for markets
 * @custom:address 0x9eB6d0D85FCc07Bf34D69913031ade9E16BD5dB0
 */
interface IMorphoIRM {
    /**
     * @notice Calculates the current borrow rate
     * @param totalSupplyAssets The total assets supplied to the market
     * @param totalBorrowAssets The total assets borrowed from the market
     * @param utilization The current utilization rate of the market (scaled by 1e18)
     * @return The borrow rate per second (scaled by 1e18)
     */
    function borrowRate(
        uint256 totalSupplyAssets,
        uint256 totalBorrowAssets,
        uint256 utilization
    ) external view returns (uint256);
} 