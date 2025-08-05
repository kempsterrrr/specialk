// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../IERC20.sol";

/**
 * @title IKAT
 * @notice Interface for KAT, the native token on Katana
 * @dev KAT implements the standard ERC-20 interface
 * @custom:katana 0x7f1f4b4b29f5058fa32cc7a97141b8d7e5abdc2d
 */
interface IKAT is IERC20 {
    // KAT fully implements the ERC-20 standard
    // This interface exists to document the token address and potential future extensions
} 