# Michal Polak Token

This is  project of my personal token based on truffle framework and [OpenZeppelin](https://openzeppelin.org/). It is a good example to learn how to use truffle and OpenZeppelin.

<h5>THIS TOKEN HAS NOT BEEN AUDITED AND IS NOT RECOMMENDED FOR PRODUCTION FUNDS !</h5>

## Contract 

### Test version (v0.2.4)
The token contract is published on ropston network at address
[0x12ead8bffa9ba8d19d0b00b42daa019c45e96a1d](https://ropsten.etherscan.io/token/0x12ead8bffa9ba8d19d0b00b42daa019c45e96a1d)

### Free tokens

Please send me short message on [this](mailto:michal.polak.token@gmail.com) email. Write me why do you want these tokens and remember to add your account address. Maybe I will send you some tokens.  

Currently I am sending on ropsten network.

### Wallets

If you want to use MPT you can use newest version of MetaMask.

## Development

### Recomended tools
 
* [Chocolatey](https://github.com/chocolatey/choco/wiki/Installation) - The package manager for Windows

* [Git](https://git-scm.com/downloads) - Simple way to get project from GitHub 

* [Meta Mask](https://metamask.io/) - It allows you to run Ethereum dApps in your browser

* [Visual Studio Code](https://code.visualstudio.com/) - Only if you want write a code

* [NodeJS](https://docs.npmjs.com/getting-started/installing-node) - Dependencies management 

* [INFURA.io](https://infura.io/) - Create account on this site, it helps deploy contracts on network 


### Prepare the project

* Get project from github `git clone https://github/polakm/MichalPolakToken.git`

* Install dependencies by running `npm install` in your project directory

### Compile

To build contracts start terminal in your project directory and run 

```
truffle compile
```

Compiled contracts will be in directory build/contracts.

### Tests

Before start test you have to run local network. You can use simple command line terminal and run 

```
ganache-cli
```

In this way, you can run all tests.

```
truffle test
```

It is example to run specific test

```
truffle test /test/Tranfering.test.js
```

### Deployment

You have to get account with some ether. If you use ropsten network you can use [this](https://faucet.ropsten.be/) faucet.

Before deploy you have to create file with name '.env' and set in this file variables `MNENOMIC` and `INFURA_API_KEY`. 

```
MNENOMIC = // Your metamask's recovery words
INFURA_API_KEY = // Your Infura API Key after its registration
```

Example for deployment on ropsten network
```
truffle deployment --network ropsten
```


## Author 

**Michał Polak**

See my other projects on my [GitHub](https://github.com/polakm)

If you can read polish, you can also visit my website [http://michalpolak.com.pl](https://michalpolak.com.pl/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
