import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.20",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
});
