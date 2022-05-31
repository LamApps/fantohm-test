import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Vault Test", () => {
  let Token;
  // const cryptoPunksId = 1;
  let abcToken: Contract;
  let vaultContract: Contract;
  // eslint-disable-next-line no-unused-vars
  let firstWallet: SignerWithAddress;
  // eslint-disable-next-line no-unused-vars
  let secondWallet: SignerWithAddress;
  // eslint-disable-next-line no-unused-vars
  let thirdWallet: SignerWithAddress;
  // eslint-disable-next-line no-unused-vars
  let fourthWallet: SignerWithAddress;
  describe("Deploy", () => {
    it("Should deploy the contracts", async () => {
      [firstWallet, secondWallet, thirdWallet, fourthWallet] =
        await ethers.getSigners();
      console.log("first wallet: ", firstWallet.address);
      console.log("second wallet: ", secondWallet.address);
      console.log("third wallet: ", thirdWallet.address);
      console.log("fourth wallet: ", fourthWallet.address);
      Token = await ethers.getContractFactory("ABC");
      abcToken = await Token.deploy();
      console.log("abcToken address: ", abcToken.address);
      Token = await ethers.getContractFactory("Vault");
      vaultContract = await Token.deploy();
      console.log("vaultContract address: ", vaultContract.address);
    });
  });

  describe("ABC Token Mint", () => {
    it("Should mint tokens between accounts", async () => {
      expect(await abcToken.balanceOf(firstWallet.address)).to.equal(0);
      expect(await abcToken.balanceOf(secondWallet.address)).to.equal(0);
      expect(await abcToken.balanceOf(thirdWallet.address)).to.equal(0);
      expect(await abcToken.balanceOf(fourthWallet.address)).to.equal(0);

      let tx = await abcToken
        .connect(firstWallet)
        .mint(firstWallet.address, "1000000000000000000000");
      await tx.wait();
      tx = await abcToken
        .connect(secondWallet)
        .mint(secondWallet.address, "1000000000000000000000");
      await tx.wait();
      tx = await abcToken
        .connect(thirdWallet)
        .mint(thirdWallet.address, "1000000000000000000000");
      await tx.wait();
      tx = await abcToken
        .connect(fourthWallet)
        .mint(fourthWallet.address, "1000000000000000000000");
      await tx.wait();
      expect(
        (await abcToken.balanceOf(firstWallet.address)).toString()
      ).to.equal("1000000000000000000000");
      expect(
        (await abcToken.balanceOf(secondWallet.address)).toString()
      ).to.equal("1000000000000000000000");
      expect(
        (await abcToken.balanceOf(thirdWallet.address)).toString()
      ).to.equal("1000000000000000000000");
      expect(
        (await abcToken.balanceOf(fourthWallet.address)).toString()
      ).to.equal("1000000000000000000000");
    });
  });

  describe("Approve ABC Token to Vault contract", () => {
    it("Should approve ABC token to Vault Lending", async () => {
      let tx = await abcToken
        .connect(firstWallet)
        .approve(
          vaultContract.address,
          "100000000000000000000000000000000000000000"
        );
      await tx.wait();
      tx = await abcToken
        .connect(secondWallet)
        .approve(
          vaultContract.address,
          "100000000000000000000000000000000000000000"
        );
      await tx.wait();
      tx = await abcToken
        .connect(thirdWallet)
        .approve(
          vaultContract.address,
          "100000000000000000000000000000000000000000"
        );
      await tx.wait();
      tx = await abcToken
        .connect(fourthWallet)
        .approve(
          vaultContract.address,
          "100000000000000000000000000000000000000000"
        );
      await tx.wait();
      const balance = await abcToken.allowance(
        firstWallet.address,
        vaultContract.address
      );
      console.log("balance: ", balance);
      expect(
        (
          await abcToken.allowance(firstWallet.address, vaultContract.address)
        ).toString()
      ).to.equal("100000000000000000000000000000000000000000");
      expect(
        (
          await abcToken.allowance(secondWallet.address, vaultContract.address)
        ).toString()
      ).to.equal("100000000000000000000000000000000000000000");
      expect(
        (
          await abcToken.allowance(thirdWallet.address, vaultContract.address)
        ).toString()
      ).to.equal("100000000000000000000000000000000000000000");
      expect(
        (
          await abcToken.allowance(fourthWallet.address, vaultContract.address)
        ).toString()
      ).to.equal("100000000000000000000000000000000000000000");
    });
  });

  describe("Deposit and Withdraw ABC token to Vault contract", () => {
    it("Should deposit ABC token", async () => {
      let tx = await vaultContract
        .connect(firstWallet)
        .deposit(abcToken.address, "8000");
      await tx.wait();
      tx = await vaultContract
        .connect(secondWallet)
        .deposit(abcToken.address, "10000");
      await tx.wait();
      tx = await vaultContract
        .connect(thirdWallet)
        .deposit(abcToken.address, "40000");
      await tx.wait();
      tx = await vaultContract
        .connect(fourthWallet)
        .deposit(abcToken.address, "30000");
      await tx.wait();
      tx = await vaultContract
        .connect(fourthWallet)
        .withdraw(abcToken.address, "15000");
      await tx.wait();
    });
  });

  describe("Get top funders", () => {
    it("Should get top funders", async () => {
      const [wallet1, wallet2] = await vaultContract.getMostFunders();
      console.log("wallet1: ", wallet1);
      console.log("wallet2: ", wallet2);
      const topFunder0 = await vaultContract.topFunders(0);
      const topFunder1 = await vaultContract.topFunders(1);
      const topFunder2 = await vaultContract.topFunders(2);
      const userInfos0 = await vaultContract.userInfos(0);
      const userInfos1 = await vaultContract.userInfos(1);
      const userInfos2 = await vaultContract.userInfos(2);
      const userInfos3 = await vaultContract.userInfos(3);
      console.log("topFunder0: ", topFunder0);
      console.log("topFunder1: ", topFunder1);
      console.log("topFunder2: ", topFunder2);
      console.log("userInfos0: ", userInfos0);
      console.log("userInfos1: ", userInfos1);
      console.log("userInfos2: ", userInfos2);
      console.log("userInfos3: ", userInfos3);
    });
  });
});
