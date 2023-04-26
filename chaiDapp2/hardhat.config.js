require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("dotenv").config();
// import('hardhat/config').HardhatUserConfig;

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
