import { ethers } from "hardhat";

async function main() {
  console.log("Deploying GenerativeArtNFT contract...");

  const GenerativeArtNFT = await ethers.getContractFactory("GenerativeArtNFT");
  const nft = await GenerativeArtNFT.deploy();

  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log(`GenerativeArtNFT deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
