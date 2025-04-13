// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IERC4337.sol";
import "./IERC4337Account.sol";
import "./IStakeManager.sol";
import "./INonceManager.sol";

/**
 * @title IEntryPoint v0.7.0
 * @notice Account-Abstraction (EIP-4337) singleton EntryPoint
 * @dev Only one instance required on each chain
 * @custom:address 0x0000000071727De22E5E9d8BAf0edAc6f37da032
 */
interface IEntryPoint is IStakeManager, INonceManager {
    /**
     * @dev Structure for return info
     */
    struct ReturnInfo {
        uint256 preOpGas;
        uint256 prefund;
        bool sigFailed;
        uint48 validAfter;
        uint48 validUntil;
        bytes paymasterContext;
    }

    /**
     * @dev Structure for aggregator stake info
     */
    struct AggregatorStakeInfo {
        address aggregator;
        IStakeManager.StakeInfo stakeInfo;
    }

    /**
     * @dev Get the required prefund for an operation
     * @param userOp The user operation
     * @return requiredPrefund The required prefund amount
     */
    function getRequiredPrefund(PackedUserOperation calldata userOp) external pure returns (uint256 requiredPrefund);

    /**
     * @dev Get the sender address for an operation
     * @param initCode The init code from the operation
     * @return sender The sender address
     * @dev This method always reverts with SenderAddressResult
     */
    function getSenderAddress(bytes memory initCode) external;

    /**
     * @dev Check deposit info for an account
     * @param account The account to check
     * @return IStakeManager.DepositInfo Deposit information
     */
    function getDepositInfo(address account) external view returns (IStakeManager.DepositInfo memory);

    /**
     * @dev Get the code hash of a contract
     * @param contract_ The contract to check
     * @return codeHash The code hash
     */
    function getCodeHashOf(address contract_) external view returns (bytes32 codeHash);

    /**
     * @dev Execute a batch of UserOperations
     * @param ops Array of UserOperations
     * @param beneficiary Address to receive fees
     */
    function handleOps(PackedUserOperation[] calldata ops, address payable beneficiary) external;

    /**
     * @dev Execute a UserOperation
     * @param op The UserOperation to execute
     * @param beneficiary Address to receive fees
     * @param target The target contract for simulation
     * @param targetCallData The call data for the target
     */
    function handleOp(
        PackedUserOperation calldata op,
        address payable beneficiary,
        address target,
        bytes calldata targetCallData
    ) external;

    /**
     * @dev Set another account to authorize operations on behalf of this one
     * @param signatureAggregator Address of the aggregator
     */
    function delegateUserOperation(address signatureAggregator) external;

    /**
     * @dev Generate the request ID for an operation
     * @param userOp The user operation
     * @return userOpHash The request hash
     */
    function getUserOpHash(PackedUserOperation calldata userOp) external view returns (bytes32 userOpHash);

    /**
     * @dev Simulate a user operation validation
     * @param userOp The user operation to simulate
     */
    function simulateValidation(PackedUserOperation calldata userOp) external;

    /**
     * @dev Simulate a user operation execution
     * @param op The user operation to simulate
     * @param target The target for post-op call
     * @param targetCallData The call data for the target
     */
    function simulateHandleOp(
        PackedUserOperation calldata op,
        address target,
        bytes calldata targetCallData
    ) external;
}

/**
 * @title IAggregator Interface (v0.7.0)
 * @notice Aggregated Signatures validator for v0.7.0
 */
interface IAggregator {
    /**
     * @dev Validate aggregated signature
     * @param userOps Array of operations to validate
     * @param signature Aggregated signature
     */
    function validateSignatures(
        PackedUserOperation[] calldata userOps,
        bytes calldata signature
    ) external view;

    /**
     * @dev Validate signature of a single userOp
     * @param userOp The operation to validate
     * @return sigForUserOp Signature to include in the userOp
     */
    function validateUserOpSignature(
        PackedUserOperation calldata userOp
    ) external view returns (bytes memory sigForUserOp);

    /**
     * @dev Aggregate multiple signatures
     * @param userOps Array of operations to aggregate
     * @return aggregatedSignature The aggregated signature
     */
    function aggregateSignatures(
        PackedUserOperation[] calldata userOps
    ) external view returns (bytes memory aggregatedSignature);
}

/**
 * @title IPaymaster Interface (v0.7.0)
 * @notice Paymaster interface for v0.7.0
 */
interface IPaymaster {
    /**
     * @dev Paymaster operation modes
     */
    enum PostOpMode {
        opSucceeded, // User op succeeded
        opReverted, // User op reverted
        postOpReverted // Only used internally in EntryPoint
    }

    /**
     * @dev Validate paymaster for user operation
     * @param userOp The user operation
     * @param userOpHash Hash of the user operation
     * @param maxCost Maximum cost of the transaction
     * @return context Context for post-operation
     * @return validationData Validation data (see IAccount for format)
     */
    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external returns (bytes memory context, uint256 validationData);

    /**
     * @dev Post-operation handler
     * @param mode Operation mode
     * @param context Context from validatePaymasterUserOp
     * @param actualGasCost Actual gas cost used so far
     * @param actualUserOpFeePerGas The gas price the user operation pays
     */
    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) external;
} 