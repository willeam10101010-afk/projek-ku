const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoMining", function () {
  let usdtToken;
  let miningContract;
  let owner;
  let miner1;
  let miner2;

  const REWARD_AMOUNT = ethers.parseUnits("10", 6); // 10 USDT
  const MINING_DIFFICULTY = 2; // Lower difficulty for faster tests
  const MIN_BLOCK_TIME = 30;

  beforeEach(async function () {
    [owner, miner1, miner2] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdtToken = await MockUSDT.deploy();
    await usdtToken.waitForDeployment();

    // Deploy CryptoMining
    const CryptoMining = await ethers.getContractFactory("CryptoMining");
    miningContract = await CryptoMining.deploy(
      await usdtToken.getAddress(),
      MINING_DIFFICULTY,
      REWARD_AMOUNT,
      MIN_BLOCK_TIME
    );
    await miningContract.waitForDeployment();

    // Fund mining contract
    const fundAmount = ethers.parseUnits("100000", 6);
    await usdtToken.transfer(await miningContract.getAddress(), fundAmount);
  });

  describe("Deployment", function () {
    it("Should set the correct USDT token address", async function () {
      expect(await miningContract.usdtToken()).to.equal(await usdtToken.getAddress());
    });

    it("Should set the correct mining difficulty", async function () {
      expect(await miningContract.miningDifficulty()).to.equal(MINING_DIFFICULTY);
    });

    it("Should set the correct reward amount", async function () {
      expect(await miningContract.rewardAmount()).to.equal(REWARD_AMOUNT);
    });

    it("Should have USDT balance", async function () {
      const balance = await usdtToken.balanceOf(await miningContract.getAddress());
      expect(balance).to.be.gt(0);
    });
  });

  describe("Mining", function () {
    it("Should reject invalid proof of work", async function () {
      const invalidNonce = ethers.randomBytes(32);
      await expect(
        miningContract.connect(miner1).mine(invalidNonce)
      ).to.be.revertedWith("Invalid proof of work");
    });

    it("Should reject duplicate nonce", async function () {
      // Find a valid nonce
      let nonce;
      let hash;
      let isValid = false;
      
      for (let i = 0; i < 10000 && !isValid; i++) {
        nonce = ethers.randomBytes(32);
        hash = ethers.keccak256(
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["address", "bytes32", "uint256"],
            [miner1.address, nonce, (await ethers.provider.getBlock("latest")).timestamp + 1]
          )
        );
        isValid = await miningContract.checkDifficulty(hash);
      }

      if (isValid) {
        await miningContract.connect(miner1).mine(nonce);
        
        // Try to use the same nonce again
        await expect(
          miningContract.connect(miner1).mine(nonce)
        ).to.be.revertedWith("Nonce already used");
      }
    });

    it("Should update miner statistics", async function () {
      // Find a valid nonce
      let nonce;
      let hash;
      let isValid = false;
      
      for (let i = 0; i < 10000 && !isValid; i++) {
        nonce = ethers.randomBytes(32);
        hash = ethers.keccak256(
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["address", "bytes32", "uint256"],
            [miner1.address, nonce, (await ethers.provider.getBlock("latest")).timestamp + 1]
          )
        );
        isValid = await miningContract.checkDifficulty(hash);
      }

      if (isValid) {
        const balanceBefore = await usdtToken.balanceOf(miner1.address);
        await miningContract.connect(miner1).mine(nonce);
        const balanceAfter = await usdtToken.balanceOf(miner1.address);

        expect((balanceAfter - balanceBefore).toString()).to.equal(REWARD_AMOUNT.toString());

        const [totalMined, , successfulMines] = await miningContract.getMinerStats(miner1.address);
        expect(totalMined).to.equal(REWARD_AMOUNT);
        expect(successfulMines).to.equal(1);
      }
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update difficulty", async function () {
      const newDifficulty = 5;
      await miningContract.updateDifficulty(newDifficulty);
      expect(await miningContract.miningDifficulty()).to.equal(newDifficulty);
    });

    it("Should allow owner to update reward", async function () {
      const newReward = ethers.parseUnits("20", 6);
      await miningContract.updateReward(newReward);
      expect(await miningContract.rewardAmount()).to.equal(newReward);
    });

    it("Should prevent non-owner from updating difficulty", async function () {
      await expect(
        miningContract.connect(miner1).updateDifficulty(5)
      ).to.be.reverted;
    });

    it("Should allow owner to withdraw rewards", async function () {
      const withdrawAmount = ethers.parseUnits("1000", 6);
      const balanceBefore = await usdtToken.balanceOf(owner.address);
      
      await miningContract.withdrawRewards(withdrawAmount);
      
      const balanceAfter = await usdtToken.balanceOf(owner.address);
      expect(balanceAfter - balanceBefore).to.equal(withdrawAmount);
    });
  });

  describe("Difficulty Check", function () {
    it("Should validate hash difficulty correctly", async function () {
      // Test with different hash values
      // Difficulty 2 means hash must be <= max >> 16
      const difficulty = await miningContract.miningDifficulty();
      expect(difficulty).to.equal(2);
      
      // A hash with leading zeros should pass
      const lowHash = "0x0000000000000000000000000000000000000000000000000000000000000001";
      const isValidLow = await miningContract.checkDifficulty(lowHash);
      expect(isValidLow).to.be.true;
      
      // A hash with high value should fail
      const highHash = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
      const isValidHigh = await miningContract.checkDifficulty(highHash);
      expect(isValidHigh).to.be.false;
    });
  });

  describe("Contract Balance", function () {
    it("Should return correct contract balance", async function () {
      const balance = await miningContract.getContractBalance();
      expect(balance).to.be.gt(0);
    });
  });
});
