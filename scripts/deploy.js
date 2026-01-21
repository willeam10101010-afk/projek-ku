import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const initialMessage = "Hello, Decentralized World!";
  
  console.log("Deploying MessageStorage contract...");
  
  const MessageStorage = await ethers.getContractFactory("MessageStorage");
  const messageStorage = await MessageStorage.deploy(initialMessage);
  
  await messageStorage.waitForDeployment();
  
  const address = await messageStorage.getAddress();
  console.log("MessageStorage deployed to:", address);
  console.log("Initial message:", await messageStorage.getMessage());
  
  // Save deployment info
  const deploymentInfo = {
    address: address,
    initialMessage: initialMessage,
    network: network.name,
    deployer: (await ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "deployment/deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment/deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
