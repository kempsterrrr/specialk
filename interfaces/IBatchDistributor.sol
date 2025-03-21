// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Simple interface for ERC-20 token functionality needed by the distributor
 */
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * @title IBatchDistributor
 * @dev Interface for the native and ERC-20 token batch distribution contract
 * @notice Allows gas-efficient distribution of ETH and ERC-20 tokens to multiple recipients in one transaction
 * @custom:address 0x36C38895A20c835F9A6A294821D669995eB2265E
 */
interface IBatchDistributor {
    /**
     * @dev Transaction struct for the recipient and amount data
     */
    struct Transaction {
        address payable recipient;
        uint256 amount;
    }

    /**
     * @dev Batch struct containing an array of transactions
     */
    struct Batch {
        Transaction[] txns;
    }

    /**
     * @dev Error thrown when an ETH transfer fails
     * @param emitter The contract that emitted the error
     */
    error EtherTransferFail(address emitter);

    /**
     * @notice Distributes ETH to multiple recipients in a single transaction
     * @dev Any excess ETH is refunded to the sender
     * @param batch A struct containing an array of recipient/amount pairs
     */
    function distributeEther(Batch calldata batch) external payable;

    /**
     * @notice Distributes ERC-20 tokens to multiple recipients in a single transaction
     * @dev Optimized to save gas by batching transfers
     * @param token The ERC-20 token contract address
     * @param batch A struct containing an array of recipient/amount pairs
     */
    function distributeToken(IERC20 token, Batch calldata batch) external;
} 