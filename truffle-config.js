require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', 
    },
    ropsten: {
      provider: new HDWalletProvider(process.env.MNEMONIC,'https://ropsten.infura.io/' + process.env.INFURA_API_KEY),
      network_id: 3,
      gasPrice: 0x01 
    },
    main: {
      provider: new HDWalletProvider(process.env.MNEMONIC,'https://main.infura.io/' + process.env.INFURA_API_KEY),
      network_id: 1,
      gasPrice: 0x01  
    },
  },
};