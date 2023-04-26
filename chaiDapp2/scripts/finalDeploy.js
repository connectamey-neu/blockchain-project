const hre = require("hardhat");

async function main() {
  const chai = await hre.ethers.getContractFactory("chai");
  const contract = await chai.deploy(); //instance of contract
  // const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  await contract.deployed();
  // console.log("owner address ", owner.address);
  console.log("Address of contract:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
