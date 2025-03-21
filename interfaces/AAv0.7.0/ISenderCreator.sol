// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ISenderCreator Interface (v0.7.0)
 * @notice Helper contract for creating sender accounts
 * @dev Used by the EntryPoint to deploy new accounts using the "initCode"
 * @custom:address 0x00000000FC04c59277B65Bc2AC8c843392C3ca4c
 */
interface ISenderCreator {
    /**
     * @dev Create a sender account using provided initialization code
     * @param initCode Initialization code for the new account
     * @return sender The address of the created account
     */
    function createSender(bytes calldata initCode) external returns (address sender);
} 