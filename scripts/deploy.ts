// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, run } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const CryptoPunksMarket = await ethers.getContractFactory(
    "CryptoPunksMarket"
  );
  const cryptoPunksMarket = await CryptoPunksMarket.deploy();

  const UsdbLending = await ethers.getContractFactory("UsdbLending");
  const usdbLending = await UsdbLending.deploy();

  const Usdb = await ethers.getContractFactory("Usdb");
  const usdb = await Usdb.deploy();

  await cryptoPunksMarket.deployed();
  await usdbLending.deployed();
  await usdb.deployed();

  console.log("cryptoPunksMarket deployed to:", cryptoPunksMarket.address);
  console.log("usdbLending deployed to:", usdbLending.address);
  console.log("usdb deployed to:", usdb.address);

  await run("verify:verify", {
    address: cryptoPunksMarket.address,
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: usdbLending.address,
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: usdb.address,
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
