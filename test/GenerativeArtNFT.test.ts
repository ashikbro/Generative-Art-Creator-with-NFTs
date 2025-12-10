import { expect } from "chai";
import { ethers } from "hardhat";
import type { GenerativeArtNFT } from "../types/contracts";
import type { Signer } from "ethers";

describe("GenerativeArtNFT", function () {
  let nft: GenerativeArtNFT;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const GenerativeArtNFT = await ethers.getContractFactory("GenerativeArtNFT");
    nft = await GenerativeArtNFT.deploy() as GenerativeArtNFT;
    await nft.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nft.connect(addr1).mintArt(tokenURI);
      await tx.wait();

      expect(await nft.totalSupply()).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(await addr1.getAddress());
      expect(await nft.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should increment token IDs", async function () {
      await nft.connect(addr1).mintArt("uri1");
      await nft.connect(addr2).mintArt("uri2");

      expect(await nft.totalSupply()).to.equal(2);
      expect(await nft.ownerOf(1)).to.equal(await addr1.getAddress());
      expect(await nft.ownerOf(2)).to.equal(await addr2.getAddress());
    });
  });

  describe("Listing", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintArt("uri1");
    });

    it("Should list NFT for sale", async function () {
      const price = ethers.parseEther("1.0");
      await nft.connect(addr1).listForSale(1, price);

      expect(await nft.listedForSale(1)).to.be.true;
      expect(await nft.tokenPrices(1)).to.equal(price);
    });

    it("Should fail if non-owner tries to list", async function () {
      const price = ethers.parseEther("1.0");
      await expect(
        nft.connect(addr2).listForSale(1, price)
      ).to.be.revertedWith("Only the owner can list the NFT");
    });

    it("Should fail if price is zero", async function () {
      await expect(
        nft.connect(addr1).listForSale(1, 0)
      ).to.be.revertedWith("Price must be greater than 0");
    });
  });

  describe("Unlisting", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintArt("uri1");
      const price = ethers.parseEther("1.0");
      await nft.connect(addr1).listForSale(1, price);
    });

    it("Should unlist NFT from sale", async function () {
      await nft.connect(addr1).unlistFromSale(1);

      expect(await nft.listedForSale(1)).to.be.false;
      expect(await nft.tokenPrices(1)).to.equal(0);
    });

    it("Should fail if non-owner tries to unlist", async function () {
      await expect(
        nft.connect(addr2).unlistFromSale(1)
      ).to.be.revertedWith("Only the owner can unlist the NFT");
    });
  });

  describe("Buying", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintArt("uri1");
      const price = ethers.parseEther("1.0");
      await nft.connect(addr1).listForSale(1, price);
    });

    it("Should allow buying listed NFT", async function () {
      const price = ethers.parseEther("1.0");
      const addr1Address = await addr1.getAddress();
      const addr2Address = await addr2.getAddress();
      
      const initialBalance = await ethers.provider.getBalance(addr1Address);
      
      await nft.connect(addr2).buyArt(1, { value: price });

      expect(await nft.ownerOf(1)).to.equal(addr2Address);
      expect(await nft.listedForSale(1)).to.be.false;
      
      const finalBalance = await ethers.provider.getBalance(addr1Address);
      expect(finalBalance - initialBalance).to.equal(price);
    });

    it("Should fail if NFT is not listed", async function () {
      await nft.connect(addr1).unlistFromSale(1);
      const price = ethers.parseEther("1.0");
      
      await expect(
        nft.connect(addr2).buyArt(1, { value: price })
      ).to.be.revertedWith("NFT is not listed for sale");
    });

    it("Should fail with insufficient payment", async function () {
      const insufficientPrice = ethers.parseEther("0.5");
      
      await expect(
        nft.connect(addr2).buyArt(1, { value: insufficientPrice })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should refund excess payment", async function () {
      const price = ethers.parseEther("1.0");
      const excessPrice = ethers.parseEther("2.0");
      const addr2Address = await addr2.getAddress();
      
      const initialBalance = await ethers.provider.getBalance(addr2Address);
      
      const tx = await nft.connect(addr2).buyArt(1, { value: excessPrice });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * tx.gasPrice!;
      
      const finalBalance = await ethers.provider.getBalance(addr2Address);
      const expectedBalance = initialBalance - price - gasUsed;
      
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
    });
  });

  describe("Token queries", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintArt("uri1");
      await nft.connect(addr1).mintArt("uri2");
      await nft.connect(addr2).mintArt("uri3");
    });

    it("Should return tokens of owner", async function () {
      const addr1Tokens = await nft.tokensOfOwner(await addr1.getAddress());
      const addr2Tokens = await nft.tokensOfOwner(await addr2.getAddress());

      expect(addr1Tokens.length).to.equal(2);
      expect(addr2Tokens.length).to.equal(1);
      expect(addr1Tokens[0]).to.equal(1);
      expect(addr1Tokens[1]).to.equal(2);
      expect(addr2Tokens[0]).to.equal(3);
    });

    it("Should return total supply", async function () {
      expect(await nft.totalSupply()).to.equal(3);
    });
  });
});
