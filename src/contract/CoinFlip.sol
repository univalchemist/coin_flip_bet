//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CoinFlipBet {
  // console.log("Deploying a Greeter with greeting:", _greeting);
  // Defines the betting options. Head==0; Tail==1.
  enum BetOption {HEAD, TAIL}
  event NewBetPlaced(uint amount, BetOption option1, BetOption option2);
  // Represents a player's bet.
  struct Bet {
    address player;
    uint amount;
    BetOption option;
  }
  // The contract's instance owner.
  address public owner;
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  modifier notOwner() {
    require(msg.sender != owner);
    _;
  }
  constructor() {
    owner = msg.sender;
  }

  function placeBet(uint option) external payable notOwner {
    require(msg.value > 0, "Require ETH for betting");
    require(option <= uint(BetOption.TAIL), "Invalid option for betting");
    BetOption result = flipCoin();
    BetOption betted = BetOption(option);
    if (result == betted) { // In case bet is correct
      payable(msg.sender).transfer(msg.value * 2);
    }
    emit NewBetPlaced(msg.value, result, betted);
  }
  function flipCoin() private view returns (BetOption) {
    // PS: Known insecure random generation (designed for simplicity).
    return BetOption(uint(keccak256(abi.encodePacked(block.timestamp, (block.number - 1)))) % 2);
  }
  function withdraw() public onlyOwner returns(bool) {
    require(address(this).balance > 0, "Insufficient amount to withdraw");
    payable(owner).transfer(address(this).balance);
    return true;
  }
}
