// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CoinFlipper
 * @dev A simple contract that simulates coin flips and stores results
 */
contract CoinFlipper {
    // Struct to store flip results
    struct FlipResult {
        bool isHeads;
        uint256 timestamp;
        address player;
    }

    // Array to store all flip results
    FlipResult[] public flipHistory;

    // Event emitted on each flip
    event CoinFlipped(address indexed player, bool isHeads, uint256 timestamp);

    /**
     * @dev Flips a coin and stores the result
     * @return bool true for heads, false for tails
     */
    function flipCoin() public returns (bool) {
        // Use block hash and sender address for randomness
        // Note: This is not cryptographically secure, but sufficient for demo
        bytes32 randomHash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                msg.sender,
                block.timestamp
            )
        );
        
        // Use the first byte of the hash to determine heads/tails
        bool isHeads = uint8(randomHash[0]) > 127;
        
        // Store the result
        flipHistory.push(
            FlipResult({
                isHeads: isHeads,
                timestamp: block.timestamp,
                player: msg.sender
            })
        );
        
        // Emit the event
        emit CoinFlipped(msg.sender, isHeads, block.timestamp);
        
        return isHeads;
    }

    /**
     * @dev Get the total number of flips
     * @return uint256 number of flips
     */
    function getFlipCount() public view returns (uint256) {
        return flipHistory.length;
    }

    /**
     * @dev Get multiple flip results at once
     * @param startIndex start index in the history
     * @param count number of results to return
     * @return FlipResult[] array of flip results
     */
    function getFlipResults(uint256 startIndex, uint256 count) 
        public 
        view 
        returns (FlipResult[] memory) 
    {
        require(startIndex < flipHistory.length, "Start index out of bounds");
        
        // Adjust count if it would exceed array bounds
        if (startIndex + count > flipHistory.length) {
            count = flipHistory.length - startIndex;
        }
        
        FlipResult[] memory results = new FlipResult[](count);
        for (uint256 i = 0; i < count; i++) {
            results[i] = flipHistory[startIndex + i];
        }
        
        return results;
    }
}
