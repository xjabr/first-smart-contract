// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract WorkContract {
  using Counters for Counters.Counter;
  Counters.Counter private itemIds;

  constructor() {}

  struct ContractInfo {
    uint256 itemId;
    address to;
    address from;
    bool signed;
  }
  mapping(uint256 => ContractInfo) private items;

  function addContract(address to) public {
    itemIds.increment();
    uint256 itemId = itemIds.current();
    items[itemId] = ContractInfo(itemId, to, msg.sender, false);
  }

  function signAContract(uint256 itemId) public {
    ContractInfo storage item = items[itemId];
    if (item.to == msg.sender) {
      item.signed = true;
      items[itemId] = item;
    }
  }

  function getAllItems() public view returns (ContractInfo[] memory) {
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < itemIds.current(); i++) { // get sizes of itemsIds
      itemCount += 1;
    }

    ContractInfo[] memory contracts = new ContractInfo[](itemCount);
    
    for (uint256 i = 0; i < itemIds.current(); i++) {
      uint256 currentId = i + 1;
      ContractInfo storage currentItem = items[currentId];
    
      contracts[currentIndex] = currentItem;
      currentIndex += 1;
    }

    return contracts;
  }

  function getSingleContract(uint256 itemId) public view returns (ContractInfo memory) {
    return items[itemId];
  }
}
