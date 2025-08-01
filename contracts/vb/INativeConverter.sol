// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title INativeConverter
 * @notice Interface for Native Converter contracts that handle conversion between native tokens and yield-exposing tokens
 * @dev Acts as a pseudo-ERC4626 vault with limited functionality
 */
interface INativeConverter {
    /**
     * @notice Enum for cross-network instructions
     * @param COMPLETE_MIGRATION Instruction to complete a migration process
     */
    enum CrossNetworkInstruction {
        COMPLETE_MIGRATION
    }

    /**
     * @notice Returns the address of the custom token
     * @return The custom token address
     */
    function customToken() external view returns (address);

    /**
     * @notice Returns the address of the underlying token
     * @return The underlying token address
     */
    function underlyingToken() external view returns (address);

    /**
     * @notice Returns the amount of backing on the current layer
     * @return The amount of backing on Layer Y
     */
    function backingOnLayerY() external view returns (uint256);

    /**
     * @notice Returns the percentage of backing that cannot be migrated
     * @return The non-migratable backing percentage (1 = 1%)
     */
    function nonMigratableBackingPercentage() external view returns (uint256);

    /**
     * @notice Returns the contract version
     * @return Version string
     */
    function version() external pure returns (string memory);

    /**
     * @notice Converts the underlying token to the custom token
     * @param underlyingAmount Amount of underlying token to convert
     * @param receiver Address that will receive the custom token
     * @return The amount of custom token minted
     */
    function deposit(uint256 underlyingAmount, address receiver) external returns (uint256);

    /**
     * @notice Converts the custom token back to the underlying token
     * @param customAmount Amount of custom token to convert
     * @param receiver Address that will receive the underlying token
     * @param owner Address that owns the custom tokens
     * @return The amount of underlying token returned
     */
    function withdraw(uint256 customAmount, address receiver, address owner) external returns (uint256);

    /**
     * @notice Estimates the amount of custom token that would be minted for a given amount of underlying token
     * @param underlyingAmount Amount of underlying token
     * @return The estimated amount of custom token
     */
    function previewDeposit(uint256 underlyingAmount) external view returns (uint256);

    /**
     * @notice Estimates the amount of underlying token that would be received for a given amount of custom token
     * @param customAmount Amount of custom token
     * @return The estimated amount of underlying token
     */
    function previewWithdraw(uint256 customAmount) external view returns (uint256);

    /**
     * @notice Initiates a migration of backing from Layer Y to Layer X
     * @param amount Amount to migrate
     * @return The amount actually migrated
     */
    function migrateToLayerX(uint256 amount) external returns (uint256);

    /**
     * @notice Returns the current owner of the contract
     * @return The owner address
     */
    function owner() external view returns (address);

    /**
     * @notice Returns the address of the migration manager
     * @return The migration manager address
     */
    function migrationManager() external view returns (address);

    /**
     * @notice Checks if the contract is paused
     * @return True if the contract is paused
     */
    function paused() external view returns (bool);
} 