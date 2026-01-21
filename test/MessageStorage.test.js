import { expect } from "chai";
import { ethers } from "hardhat";

describe("MessageStorage", function () {
  let messageStorage;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const MessageStorage = await ethers.getContractFactory("MessageStorage");
    messageStorage = await MessageStorage.deploy("Hello World!");
    await messageStorage.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await messageStorage.owner()).to.equal(owner.address);
    });

    it("Should set the initial message", async function () {
      expect(await messageStorage.getMessage()).to.equal("Hello World!");
    });
  });

  describe("Message Management", function () {
    it("Should update the message", async function () {
      await messageStorage.setMessage("New Message");
      expect(await messageStorage.getMessage()).to.equal("New Message");
    });

    it("Should emit MessageUpdated event", async function () {
      await expect(messageStorage.setMessage("Test Message"))
        .to.emit(messageStorage, "MessageUpdated")
        .withArgs("Test Message", owner.address);
    });

    it("Should allow anyone to update the message", async function () {
      await messageStorage.connect(addr1).setMessage("Message from addr1");
      expect(await messageStorage.getMessage()).to.equal("Message from addr1");
    });
  });
});
