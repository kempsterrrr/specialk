// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {Lock} from "../src/Lock.sol";

contract LockTest is Test {
    Lock public lock;
    uint256 public unlockTime;
    uint256 public lockedAmount = 1 ether;
    address payable public owner;
    address payable public otherUser;

    function setUp() public {
        owner = payable(makeAddr("owner"));
        otherUser = payable(makeAddr("other"));
        unlockTime = block.timestamp + 1 days;
        
        // Give owner some ETH
        vm.deal(owner, 10 ether);
        
        // Deploy contract as owner
        vm.prank(owner);
        lock = new Lock{value: lockedAmount}(unlockTime);
    }

    function test_Constructor() public {
        assertEq(lock.unlockTime(), unlockTime);
        assertEq(lock.owner(), owner);
        assertEq(address(lock).balance, lockedAmount);
    }

    function testRevert_ConstructorPastTime() public {
        vm.warp(block.timestamp + 2 days); // Move time forward
        vm.expectRevert("Unlock time should be in the future");
        new Lock(block.timestamp - 1);
    }

    function testRevert_WithdrawTooEarly() public {
        vm.prank(owner);
        vm.expectRevert("You can't withdraw yet");
        lock.withdraw();
    }

    function testRevert_WithdrawNotOwner() public {
        vm.warp(block.timestamp + 2 days); // Move past unlock time
        vm.prank(otherUser); // Impersonate other user
        vm.expectRevert("You aren't the owner");
        lock.withdraw();
    }

    function test_Withdraw() public {
        uint256 preBalance = owner.balance;
        
        // Move time forward
        vm.warp(block.timestamp + 2 days);
        
        // Withdraw as owner
        vm.prank(owner);
        lock.withdraw();
        
        // Check balances
        assertEq(address(lock).balance, 0);
        assertEq(owner.balance, preBalance + lockedAmount);
    }

    // Fuzz test the constructor with different unlock times
    function testFuzz_Constructor(uint256 futureTime) public {
        // Bound the future time to something reasonable
        futureTime = bound(futureTime, block.timestamp + 1, block.timestamp + 100 days);
        
        vm.prank(owner);
        Lock newLock = new Lock{value: lockedAmount}(futureTime);
        assertEq(newLock.unlockTime(), futureTime);
    }
} 