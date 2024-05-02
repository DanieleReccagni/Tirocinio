require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

const { API_URL, PRIVATE_KEY, API_KEY } = process.env;

module.exports = {
   solidity: "0.8.21",
   defaultNetwork: "polygonMumbai",
   networks: {
      hardhat: {},
      polygonMumbai: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
   etherscan: {
      apiKey: {
         polygonMumbai: API_KEY
      }
   }
}