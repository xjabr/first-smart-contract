// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "hardhat/console.sol";

contract WorkContract {
  using Counters for Counters.Counter;
  Counters.Counter private itemIds;
  address owner;

  constructor() {
    owner = msg.sender;
  }

  struct Detail {
    uint256 itemId;
    address customer;
    address agency;
    bool isCompleted;
  }
  mapping(uint256 => Detail) private idToItem;

  function addContract(address customer) public {
    itemIds.increment();
    uint256 itemId = itemIds.current();

    idToItem[itemId] = Detail(itemId, customer, msg.sender, false);
  }

  // todo remove address customer
  function signAContract(address customer, uint256 itemId) public {
    Detail storage currentItem = idToItem[itemId];
    if (customer == currentItem.customer) {
      currentItem.isCompleted = true;
      idToItem[itemId] = currentItem;
    }
  }

  function fetchWorkContracts() public view returns (Detail[] memory) {
    uint256 totalItemCount = itemIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].agency == msg.sender) {
        itemCount += 1;
      }
    }

    Detail[] memory items = new Detail[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].agency == msg.sender) {
        uint256 currentId = i + 1;
        Detail storage currentItem = idToItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items;
  }
}
