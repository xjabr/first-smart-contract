const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const WorkContract = await hre.ethers.getContractFactory("WorkContract");
  const contract = await WorkContract.deploy();
  await contract.deployed();

  const config = `
    export const workContractAddress = "${contract.address}"
  `;
  const data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });