// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { getContractAddress } = require("ethers/lib/utils")
const hre = require("hardhat")
const { ethers, run, network } = require("hardhat")

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contact...")
  const SimpleStorage = await SimpleStorageFactory.deploy()
  await SimpleStorage.deployed()
  console.log(`Deployed contract to: ${SimpleStorage.address}`)

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for block confirmations...")
    await SimpleStorage.deployTransaction.wait(6)
    await verify(SimpleStorage.address, [])
  }
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
