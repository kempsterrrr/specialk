// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IERC20.sol";

/**
 * @title IweETH
 * @notice Interface for Bridge-wrapped weETH (weETH) on Katana
 * @dev weETH implements the standard ERC-20 interface
 * @custom:katana 0x9893989433e7a383Cb313953e4c2365107dc19a7
 */
interface IweETH is IERC20 {
    // weETH fully implements the ERC-20 standard
    // This interface exists to document the token address and potential future extensions
}