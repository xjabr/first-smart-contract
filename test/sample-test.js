const { expect } = require("chai");
const hre = require("hardhat");

describe("WorkContract", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const WorkContract = await hre.ethers.getContractFactory("WorkContract");
    const contract = await WorkContract.deploy(
      owner.address,
      randomPerson.address
    );
    await contract.deployed();

    await contract.customerSign();
    console.log("Is completed? ", await contract.isSignedByCustomer());
    await contract.connect(randomPerson).agencySign();

    const isCompleted = contract.contractIsCompleted();
    if (isCompleted) {
      console.log("Contract is completed");
    }
  });
});
