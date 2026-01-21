const hre = require("hardhat");

async function main() {
  console.log("Deploying Crypto Mining DApp...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MockUSDT
  console.log("\n1. Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const usdtToken = await MockUSDT.deploy();
  await usdtToken.waitForDeployment();
  const usdtAddress = await usdtToken.getAddress();
  console.log("MockUSDT deployed to:", usdtAddress);

  // Deploy CryptoMining
  console.log("\n2. Deploying CryptoMining...");
  const miningDifficulty = 4; // Number of leading zeros required
  const rewardAmount = hre.ethers.parseUnits("10", 6); // 10 USDT (6 decimals)
  const minBlockTime = 30; // 30 seconds between mining attempts

  const CryptoMining = await hre.ethers.getContractFactory("CryptoMining");
  const miningContract = await CryptoMining.deploy(
    usdtAddress,
    miningDifficulty,
    rewardAmount,
    minBlockTime
  );
  await miningContract.waitForDeployment();
  const miningAddress = await miningContract.getAddress();
  console.log("CryptoMining deployed to:", miningAddress);

  // Fund mining contract with USDT
  console.log("\n3. Funding mining contract...");
  const fundAmount = hre.ethers.parseUnits("100000", 6); // 100,000 USDT
  await usdtToken.transfer(miningAddress, fundAmount);
  console.log("Transferred", hre.ethers.formatUnits(fundAmount, 6), "USDT to mining contract");

  // Verify contract balance
  const contractBalance = await usdtToken.balanceOf(miningAddress);
  console.log("Mining contract balance:", hre.ethers.formatUnits(contractBalance, 6), "USDT");

  console.log("\n✅ Deployment completed successfully!");
  console.log("\n📝 Contract Addresses:");
  console.log("==========================================");
  console.log("MockUSDT:", usdtAddress);
  console.log("CryptoMining:", miningAddress);
  console.log("==========================================");
  console.log("\n💡 Update your .env file with these addresses:");
  console.log(`USDT_CONTRACT_ADDRESS=${usdtAddress}`);
  console.log(`MINING_CONTRACT_ADDRESS=${miningAddress}`);

  // Wait for block confirmations on testnets
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await usdtToken.deploymentTransaction().wait(6);
    await miningContract.deploymentTransaction().wait(6);
    console.log("✅ Confirmed!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
