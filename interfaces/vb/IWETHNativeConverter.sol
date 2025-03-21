// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWETH.sol";

/**
 * @title IWETHNativeConverter
 * @notice Interface for the WETH Native Converter contract that handles conversion between WETH and ETH
 * @custom:address 0x3aFbD158CF7B1E6BE4dAC88bC173FA65EBDf2EcD
 */
interface IWETHNativeConverter {
    /**
     * @notice Returns the address of the WETH contract
     * @return The WETH contract address
     */
    function weth() external view returns (IWETH);
    
    /**
     * @notice Unwraps WETH to ETH and transfers it to the recipient
     * @param wethAmount Amount of WETH to unwrap
     * @param recipient Address that will receive the ETH
     * @return The amount of ETH (should be equal to wethAmount)
     */
    function unwrapWETH(uint256 wethAmount, address payable recipient) external returns (uint256);
    
    /**
     * @notice Wraps ETH to WETH and transfers it to the recipient
     * @param recipient Address that will receive the WETH
     * @return The amount of WETH minted (should be equal to the ETH sent)
     */
    function wrapETH(address recipient) external payable returns (uint256);
    
    /**
     * @notice Unwraps all WETH held by this contract and transfers the ETH to the recipient
     * @param recipient Address that will receive the ETH
     * @return The amount of ETH transferred
     */
    function sweepETH(address payable recipient) external returns (uint256);
    
    /**
     * @notice Estimate the amount of ETH that can be unwrapped from a given amount of WETH
     * @param wethAmount Amount of WETH to estimate for
     * @return The estimated amount of ETH (should be equal to wethAmount)
     */
    function estimateUnwrapWETH(uint256 wethAmount) external view returns (uint256);
    
    /**
     * @notice Estimate the amount of WETH that can be wrapped from a given amount of ETH
     * @param ethAmount Amount of ETH to estimate for
     * @return The estimated amount of WETH (should be equal to ethAmount)
     */
    function estimateWrapETH(uint256 ethAmount) external view returns (uint256);
    
    /**
     * @notice Returns the current owner of the contract
     * @return The owner address
     */
    function owner() external view returns (address);
    
    /**
     * @notice Transfers ownership of the contract to a new account
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external;
    
    /**
     * @notice Renounces ownership of the contract
     * @dev Leaves the contract without an owner, can't be undone
     */
    function renounceOwnership() external;
    
    /**
     * @notice Fallback function to allow receiving ETH
     */
    receive() external payable;
} 