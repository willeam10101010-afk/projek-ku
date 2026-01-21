const hre = require("hardhat");

async function main() {
  console.log("Deploying Authorization contract...");

  const Authorization = await hre.ethers.getContractFactory("Authorization");
  const authorization = await Authorization.deploy();

  await authorization.deployed();

  console.log("Authorization contract deployed to:", authorization.address);
  console.log("\nUpdate your frontend .env file with:");
  console.log(`VITE_CONTRACT_ADDRESS=${authorization.address}`);
  
  // Wait for a few block confirmations
  console.log("\nWaiting for block confirmations...");
  await authorization.deployTransaction.wait(5);
  
  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
