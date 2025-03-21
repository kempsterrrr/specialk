// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IEntryPoint.sol";
import "./IERC4337Account.sol";
import "../IERC4337.sol";

/**
 * @title IEntryPointSimulations Interface (v0.7.0)
 * @notice Extended simulation interface for EntryPoint
 * @custom:address 0x0000000071727De22E5E9d8BAf0edAc6f37da032
 */
interface IEntryPointSimulations is IEntryPoint {
    /**
     * @dev Result of an execution simulation
     */
    struct ExecutionResult {
        uint256 preOpGas;
        uint256 paid;
        uint256 accountValidationData;
        uint256 paymasterValidationData;
        bool targetSuccess;
        bytes targetResult;
    }

    /**
     * @dev Simulate validation with detailed result
     * @param userOp The user operation to validate
     * @return validationResult The validation result structure
     */
    function simulateValidation(
        PackedUserOperation calldata userOp
    ) external returns (
        uint256 preOpGas,
        uint256 prefund,
        address actualAggregator,
        bytes memory paymasterContext
    );

    /**
     * @dev Simulate handle operation with detailed result
     * @param op The user operation to simulate
     * @param target The target for post-op call
     * @param targetCallData The call data for the target
     * @return executionResult The execution result structure
     */
    function simulateHandleOp(
        PackedUserOperation calldata op,
        address target,
        bytes calldata targetCallData
    ) external returns (ExecutionResult memory executionResult);
} 