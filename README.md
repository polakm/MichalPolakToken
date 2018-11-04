# Michal Polak Token

This is  project of my personal token based on truffle framework and [OpenZeppelin](https://openzeppelin.org/). It is a good example to learn how to use truffle and OpenZeppelin.

<h5>THIS TOKEN HAS NOT BEEN AUDITED AND IS NOT RECOMMENDED FOR PRODUCTION FUNDS !</h5>

## Contract 

### Actual version
The token contract is published on ropston network at address
[0xb26e88ea7a93d00123a0911a41aed7a457e0a5f0](https://ropsten.etherscan.io/token/0xb26e88ea7a93d00123a0911a41aed7a457e0a5f0)

### Free tokens

Please send me short message on [this](mailto:michal.polak.token@gmail.com) email. Write me why do you want these tokens and remember to add your account address. Maybe I will send you some tokens.  

Currently I am sending on ropsten network.

### Wallets

If you want to use MPT you can use newest version of MetaMask.

## Development

### Prepare tools and environment
 
Create accounts on MetaMask and Infura

* [Meta Mask](https://metamask.io/) - It allows you to run Ethereum dApps in your browser

* [INFURA.io](https://infura.io/) - Create account on this site, it helps deploy contracts on network 

Run commands in PowerShell with Administrator permission

```
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```
```
choco install nodejs.install -y
```
```
choco install vscode -y
```
```
choco install git -y
```
```
npm install -g truffle
```
```
npm install -g ganache-cli
```
```
choco install python2 -y
choco install vcbuildtools -y
npm config set msvs_version 2015 --global
refreshenv
```

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
truffle deploy --network ropsten --reset
```


## Author 

**Michał Polak**

See my other projects on my [GitHub](https://github.com/polakm)

If you can read polish, you can also visit my website [http://michalpolak.com.pl](https://michalpolak.com.pl/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
