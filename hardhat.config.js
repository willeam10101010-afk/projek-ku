/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 1337
    },
    // Configuration for testnets can be added here
    goerli: {
      type: "http",
      url: process.env.GOERLI_RPC_URL || "https://goerli.infura.io/v3/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
