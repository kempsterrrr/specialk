// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IYieldExposedToken.sol";

/**
 * @title IybUSDC
 * @notice Interface for the Yield-Bearing USDC token on Sepolia
 * @dev Exposes yield from USDC while maintaining the ERC20 interface
 * @custom:sepolia 0x4C8414eBFE5A55eA5859aF373371EE3233fFF7CD
 */
interface IybUSDC is IYieldExposedToken {
    /**
     * @notice Event emitted when configuration changes occur
     * @param minimumReservePercentage The minimum reserve percentage required
     * @param yieldVault The address of the yield vault
     * @param yieldRecipient The address that receives yield
     */
    event ConfigurationUpdated(uint8 minimumReservePercentage, address yieldVault, address yieldRecipient);

    /**
     * @notice Event emitted when reserve is rebalanced
     * @param assets The amount of assets rebalanced
     * @param shares The amount of shares in the yield vault
     */
    event ReserveRebalanced(uint256 assets, uint256 shares);

    /**
     * @notice Updates the minimum reserve percentage
     * @param newMinimumReservePercentage New minimum reserve percentage (1 = 1%)
     */
    function updateMinimumReservePercentage(uint8 newMinimumReservePercentage) external;

    /**
     * @notice Updates the yield vault address
     * @param newYieldVault New yield vault address
     */
    function updateYieldVault(address newYieldVault) external;

    /**
     * @notice Updates the yield recipient address
     * @param newYieldRecipient New yield recipient address
     */
    function updateYieldRecipient(address newYieldRecipient) external;

    /**
     * @notice Rebalances the reserve by depositing assets into the yield vault
     * @return The amount of assets deposited into the yield vault
     */
    function rebalanceReserve() external returns (uint256);

    /**
     * @notice Harvests yield and sends it to the yield recipient
     * @return The amount of yield harvested
     */
    function harvestYield() external returns (uint256);

    /**
     * @notice Returns the current reserve in the contract
     * @return The current reserve amount
     */
    function currentReserve() external view returns (uint256);

    /**
     * @notice Returns the minimum required reserve amount
     * @return The minimum reserve required
     */
    function minimumRequiredReserve() external view returns (uint256);

    /**
     * @notice Returns the amount of assets in the yield vault
     * @return The amount of assets in the yield vault
     */
    function assetsInYieldVault() external view returns (uint256);

    /**
     * @notice Returns information about the contract pause status
     * @return Whether the contract is paused
     */
    function paused() external view returns (bool);

    /**
     * @notice Pauses the contract, disabling certain functions
     */
    function pause() external;

    /**
     * @notice Unpauses the contract, re-enabling paused functions
     */
    function unpause() external;
} 