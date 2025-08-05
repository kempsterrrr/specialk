// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IERC20.sol";

/**
 * @title IbvUSD
 * @notice Interface for BitVault USD (bvUSD) on Katana
 * @dev bvUSD implements the standard ERC-20 interface
 * @custom:katana 0x876aac7648d79f87245e73316eb2d100e75f3df1
 */
interface IbvUSD is IERC20 {
    // bvUSD fully implements the ERC-20 standard
    // This interface exists to document the token address and potential future extensions
}