// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../INativeConverter.sol";

/**
 * @title IUSDTNativeConverter
 * @notice Interface for the USDT Native Converter on Tatara
 * @dev Converts between USDT and custom tokens on Layer Y, with migration capabilities to Layer X
 * @custom:tatara 0x8f3a47e64d3AD1fBdC5C23adD53183CcCD05D8a4
 */
interface IUSDTNativeConverter is INativeConverter {
    /**
     * @notice Emitted when configuration is updated
     * @param nonMigratableBackingPercentage The percentage of backing that can't be migrated (1 = 1%)
     * @param migrationManager The address of the migration manager
     */
    event ConfigurationUpdated(uint256 nonMigratableBackingPercentage, address migrationManager);

    /**
     * @notice Emitted when a migration to Layer X is initiated
     * @param amount The amount migrated
     */
    event MigrationToLayerX(uint256 amount);

    /**
     * @notice Emitted when a migration is completed from Layer X
     * @param amount The amount of backing received
     */
    event MigrationCompleted(uint256 amount);

    /**
     * @notice Updates the non-migratable backing percentage
     * @param newNonMigratableBackingPercentage New percentage of backing that cannot be migrated (1 = 1%)
     */
    function updateNonMigratableBackingPercentage(uint256 newNonMigratableBackingPercentage) external;

    /**
     * @notice Updates the migration manager address
     * @param newMigrationManager New migration manager address
     */
    function updateMigrationManager(address newMigrationManager) external;

    /**
     * @notice Completes a migration initiated from Layer X
     * @param amount The amount of backing to add
     * @return The amount of backing added
     */
    function completeMigration(uint256 amount) external returns (uint256);

    /**
     * @notice Calculates the maximum amount that can be migrated
     * @return The maximum amount that can be migrated
     */
    function maxMigratable() external view returns (uint256);

    /**
     * @notice Handles on-bridge message receipt
     * @param originAddress The address on the origin network that sent the message
     * @param originNetwork The network ID of the origin network
     * @param data The message data
     */
    function onMessageReceived(address originAddress, uint32 originNetwork, bytes calldata data) external;

    /**
     * @notice Returns the Layer X network ID
     * @return The Layer X network ID
     */
    function layerXNetworkId() external view returns (uint32);

    /**
     * @notice Returns the LxLy Bridge address
     * @return The LxLy Bridge address
     */
    function lxlyBridge() external view returns (address);

    /**
     * @notice Pauses the contract, disabling certain functions
     */
    function pause() external;

    /**
     * @notice Unpauses the contract, re-enabling paused functions
     */
    function unpause() external;
} 