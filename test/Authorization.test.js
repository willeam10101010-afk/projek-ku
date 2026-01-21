import { expect } from "chai";
import { ethers } from "hardhat";

describe("Authorization", function () {
  let authorization;
  let owner;
  let thirdParty1;
  let thirdParty2;
  let thirdParty3;

  beforeEach(async function () {
    [owner, thirdParty1, thirdParty2, thirdParty3] = await ethers.getSigners();
    
    const Authorization = await ethers.getContractFactory("Authorization");
    authorization = await Authorization.deploy();
  });

  describe("authorize", function () {
    it("Should allow a user to authorize a third party", async function () {
      await expect(authorization.connect(owner).authorize(thirdParty1.address))
        .to.emit(authorization, "AuthorizationGranted");
      
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.true;
    });

    it("Should add third party to authorized list", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      
      const authorizedList = await authorization.getAuthorizedList(owner.address);
      expect(authorizedList).to.include(thirdParty1.address);
      expect(authorizedList.length).to.equal(1);
    });

    it("Should reject authorization of zero address", async function () {
      await expect(
        authorization.connect(owner).authorize(ethers.ZeroAddress)
      ).to.be.revertedWith("Authorization: Cannot authorize zero address");
    });

    it("Should reject self-authorization", async function () {
      await expect(
        authorization.connect(owner).authorize(owner.address)
      ).to.be.revertedWith("Authorization: Cannot authorize self");
    });

    it("Should reject duplicate authorization", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      
      await expect(
        authorization.connect(owner).authorize(thirdParty1.address)
      ).to.be.revertedWith("Authorization: Already authorized");
    });

    it("Should allow authorizing multiple third parties", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).authorize(thirdParty2.address);
      await authorization.connect(owner).authorize(thirdParty3.address);
      
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.true;
      expect(await authorization.isAuthorized(owner.address, thirdParty2.address)).to.be.true;
      expect(await authorization.isAuthorized(owner.address, thirdParty3.address)).to.be.true;
      
      const authorizedList = await authorization.getAuthorizedList(owner.address);
      expect(authorizedList.length).to.equal(3);
    });
  });

  describe("revokeAuthorization", function () {
    beforeEach(async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
    });

    it("Should allow a user to revoke authorization", async function () {
      await expect(authorization.connect(owner).revokeAuthorization(thirdParty1.address))
        .to.emit(authorization, "AuthorizationRevoked");
      
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.false;
    });

    it("Should remove third party from authorized list", async function () {
      await authorization.connect(owner).revokeAuthorization(thirdParty1.address);
      
      const authorizedList = await authorization.getAuthorizedList(owner.address);
      expect(authorizedList.length).to.equal(0);
    });

    it("Should reject revoking zero address", async function () {
      await expect(
        authorization.connect(owner).revokeAuthorization(ethers.ZeroAddress)
      ).to.be.revertedWith("Authorization: Cannot revoke zero address");
    });

    it("Should reject revoking non-authorized address", async function () {
      await expect(
        authorization.connect(owner).revokeAuthorization(thirdParty2.address)
      ).to.be.revertedWith("Authorization: Not authorized");
    });

    it("Should correctly handle revoking from middle of list", async function () {
      await authorization.connect(owner).authorize(thirdParty2.address);
      await authorization.connect(owner).authorize(thirdParty3.address);
      
      // Revoke the middle one (thirdParty2)
      await authorization.connect(owner).revokeAuthorization(thirdParty2.address);
      
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.true;
      expect(await authorization.isAuthorized(owner.address, thirdParty2.address)).to.be.false;
      expect(await authorization.isAuthorized(owner.address, thirdParty3.address)).to.be.true;
      
      const count = await authorization.getAuthorizedCount(owner.address);
      expect(count).to.equal(2);
    });
  });

  describe("isAuthorized", function () {
    it("Should return false for non-authorized address", async function () {
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.false;
    });

    it("Should return true for authorized address", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.true;
    });

    it("Should return false after revocation", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).revokeAuthorization(thirdParty1.address);
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.false;
    });
  });

  describe("getAuthorizedList", function () {
    it("Should return empty array for user with no authorizations", async function () {
      const list = await authorization.getAuthorizedList(owner.address);
      expect(list.length).to.equal(0);
    });

    it("Should return all authorized addresses", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).authorize(thirdParty2.address);
      
      const list = await authorization.getAuthorizedList(owner.address);
      expect(list.length).to.equal(2);
      expect(list).to.include(thirdParty1.address);
      expect(list).to.include(thirdParty2.address);
    });
  });

  describe("getAuthorizedCount", function () {
    it("Should return 0 for user with no authorizations", async function () {
      const count = await authorization.getAuthorizedCount(owner.address);
      expect(count).to.equal(0);
    });

    it("Should return correct count", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).authorize(thirdParty2.address);
      
      const count = await authorization.getAuthorizedCount(owner.address);
      expect(count).to.equal(2);
    });

    it("Should return correct count after revocation", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).authorize(thirdParty2.address);
      await authorization.connect(owner).revokeAuthorization(thirdParty1.address);
      
      const count = await authorization.getAuthorizedCount(owner.address);
      expect(count).to.equal(1);
    });
  });

  describe("performAuthorizedAction", function () {
    it("Should allow user to perform action", async function () {
      const result = await authorization.connect(owner).performAuthorizedAction(owner.address);
      expect(result).to.equal("Action performed successfully");
    });

    it("Should allow authorized third party to perform action", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      
      const result = await authorization.connect(thirdParty1).performAuthorizedAction(owner.address);
      expect(result).to.equal("Action performed successfully");
    });

    it("Should reject unauthorized third party", async function () {
      await expect(
        authorization.connect(thirdParty1).performAuthorizedAction(owner.address)
      ).to.be.revertedWith("Authorization: Not authorized to act on behalf of this user");
    });

    it("Should reject after revocation", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).revokeAuthorization(thirdParty1.address);
      
      await expect(
        authorization.connect(thirdParty1).performAuthorizedAction(owner.address)
      ).to.be.revertedWith("Authorization: Not authorized to act on behalf of this user");
    });
  });

  describe("Security and Edge Cases", function () {
    it("Should maintain separate authorizations for different users", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(thirdParty2).authorize(thirdParty3.address);
      
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.true;
      expect(await authorization.isAuthorized(owner.address, thirdParty3.address)).to.be.false;
      expect(await authorization.isAuthorized(thirdParty2.address, thirdParty3.address)).to.be.true;
      expect(await authorization.isAuthorized(thirdParty2.address, thirdParty1.address)).to.be.false;
    });

    it("Should handle re-authorization after revocation", async function () {
      await authorization.connect(owner).authorize(thirdParty1.address);
      await authorization.connect(owner).revokeAuthorization(thirdParty1.address);
      await authorization.connect(owner).authorize(thirdParty1.address);
      
      expect(await authorization.isAuthorized(owner.address, thirdParty1.address)).to.be.true;
    });
  });
});
