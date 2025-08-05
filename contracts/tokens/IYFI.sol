// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IERC20.sol";

/**
 * @title IYFI
 * @notice Interface for Bridge-wrapped Yearn Finance (YFI) on Katana
 * @dev YFI implements the standard ERC-20 interface
 * @custom:katana 0x476eaCd417cD65421bD34fca054377658BB5E02b
 */
interface IYFI is IERC20 {
    // YFI fully implements the ERC-20 standard
    // This interface exists to document the token address and potential future extensions
}