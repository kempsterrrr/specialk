// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IERC20.sol";

/**
 * @title IWETH
 * @notice Interface for the Wrapped Ether (WETH) contract on Katana
 * @dev WETH is an ERC20 token that wraps ETH to make it compatible with ERC20 operations
 * @custom:address 0x17B8Ee96E3bcB3b04b3e8334de4524520C51caB4
 */
interface IWETH is IERC20 {
    /**
     * @notice Emitted when ETH is deposited and WETH is minted
     * @param src The address that deposited ETH
     * @param wad The amount of ETH deposited
     */
    event Deposit(address indexed src, uint256 wad);
    
    /**
     * @notice Emitted when WETH is withdrawn and ETH is released
     * @param src The address that withdrew WETH
     * @param wad The amount of WETH withdrawn
     */
    event Withdrawal(address indexed src, uint256 wad);
    
    /**
     * @notice Deposits ETH and mints WETH tokens
     * @dev This function is payable and will mint WETH equal to the amount of ETH sent
     */
    function deposit() external payable;
    
    /**
     * @notice Withdraws ETH and burns WETH tokens
     * @param wad The amount of WETH to burn and ETH to withdraw
     */
    function withdraw(uint256 wad) external;
    
    /**
     * @notice Returns the name of the token
     * @return The token name
     */
    function name() external view returns (string memory);
    
    /**
     * @notice Returns the symbol of the token
     * @return The token symbol
     */
    function symbol() external view returns (string memory);
    
    /**
     * @notice Returns the number of decimals the token uses
     * @return The number of decimals
     */
    function decimals() external view returns (uint8);
} 