// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IERC20.sol";

/**
 * @title IYieldExposedToken
 * @notice Interface for yield-exposed tokens that seamlessly bridge assets with yield generation
 * @dev Combines ERC20 functionality with yield generation mechanisms like ERC4626
 */
interface IYieldExposedToken is IERC20 {
    /**
     * @notice Returns the address of the underlying token
     * @return The underlying token address
     */
    function asset() external view returns (address);

    /**
     * @notice Returns the total amount of the underlying asset managed by the contract
     * @return The total amount of the underlying asset
     */
    function totalAssets() external view returns (uint256);

    /**
     * @notice Converts a given amount of assets to the corresponding amount of shares
     * @param assets The amount of assets to convert
     * @return The amount of shares that would represent the assets
     */
    function convertToShares(uint256 assets) external view returns (uint256);

    /**
     * @notice Converts a given amount of shares to the corresponding amount of assets
     * @param shares The amount of shares to convert
     * @return The amount of assets that the shares represent
     */
    function convertToAssets(uint256 shares) external view returns (uint256);

    /**
     * @notice Returns the maximum amount of the underlying asset that can be deposited
     * @param receiver The address for which the deposit is being calculated
     * @return The maximum amount of assets that can be deposited
     */
    function maxDeposit(address receiver) external view returns (uint256);

    /**
     * @notice Returns a preview of the amount of shares that would be minted for a deposit
     * @param assets The amount of assets to deposit
     * @return The amount of shares that would be minted
     */
    function previewDeposit(uint256 assets) external view returns (uint256);

    /**
     * @notice Deposits underlying assets and mints shares to the receiver
     * @param assets The amount of assets to deposit
     * @param receiver The address to receive the minted shares
     * @return The amount of shares minted
     */
    function deposit(uint256 assets, address receiver) external returns (uint256);

    /**
     * @notice Returns the maximum amount of shares that can be minted
     * @param receiver The address for which the mint is being calculated
     * @return The maximum amount of shares that can be minted
     */
    function maxMint(address receiver) external view returns (uint256);

    /**
     * @notice Returns a preview of the amount of assets needed for a mint
     * @param shares The amount of shares to mint
     * @return The amount of assets needed
     */
    function previewMint(uint256 shares) external view returns (uint256);

    /**
     * @notice Mints shares to the receiver by depositing assets
     * @param shares The amount of shares to mint
     * @param receiver The address to receive the minted shares
     * @return The amount of assets deposited
     */
    function mint(uint256 shares, address receiver) external returns (uint256);

    /**
     * @notice Returns the maximum amount of assets that can be withdrawn
     * @param owner The address that owns the shares
     * @return The maximum amount of assets that can be withdrawn
     */
    function maxWithdraw(address owner) external view returns (uint256);

    /**
     * @notice Returns a preview of the amount of shares needed for a withdrawal
     * @param assets The amount of assets to withdraw
     * @return The amount of shares that would be burned
     */
    function previewWithdraw(uint256 assets) external view returns (uint256);

    /**
     * @notice Withdraws assets to the receiver by burning shares
     * @param assets The amount of assets to withdraw
     * @param receiver The address to receive the assets
     * @param owner The address from which to burn shares
     * @return The amount of shares burned
     */
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256);

    /**
     * @notice Returns the maximum amount of shares that can be redeemed
     * @param owner The address that owns the shares
     * @return The maximum amount of shares that can be redeemed
     */
    function maxRedeem(address owner) external view returns (uint256);

    /**
     * @notice Returns a preview of the amount of assets that would be received for a redemption
     * @param shares The amount of shares to redeem
     * @return The amount of assets that would be received
     */
    function previewRedeem(uint256 shares) external view returns (uint256);

    /**
     * @notice Redeems shares for assets, sending the assets to the receiver
     * @param shares The amount of shares to redeem
     * @param receiver The address to receive the assets
     * @param owner The address from which to burn shares
     * @return The amount of assets sent to the receiver
     */
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256);

    /**
     * @notice Returns the contract version
     * @return Version string
     */
    function version() external pure returns (string memory);

    /**
     * @notice Returns the yield vault address
     * @return The address of the yield vault
     */
    function yieldVault() external view returns (address);

    /**
     * @notice Returns the address that receives yield
     * @return The yield recipient address
     */
    function yieldRecipient() external view returns (address);

    /**
     * @notice Returns the minimum reserve percentage
     * @return The minimum reserve percentage (1 = 1%)
     */
    function minimumReservePercentage() external view returns (uint8);
} 