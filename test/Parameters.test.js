const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('MichalPolakToken', function ([_, creator]) {
  let token;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    token = await MichalPolakToken.new({ from: creator });
  });

  it('The token name is "Michal Polak Token"', async function () {
    (await token.name()).should.equal('Michal Polak Token');
  });

  it('The token symbol is "MPT"', async function () {
    (await token.symbol()).should.equal('MPT');
  });

  it('Token has 18 decimals', async function () {
    (await token.decimals()).should.be.bignumber.equal(18);
  });

  it('Token cap is 21 000 000 tokens', async function () {
    (await token.cap()).should.be.bignumber.equal(21000000 * Math.pow(10, 18));
    });

  it('Total supply is 11 000 000 tokens', async function () {
    (await token.totalSupply()).should.be.bignumber.equal(11000000 * Math.pow(10, 18));
    });

  it('Creator is a owner',async function () {
      (await token.owner()).should.equal(creator);
  });

  it('Creator is a owner',async function () {
    (await token.isOwner({from: creator})).should.be.equal(true);
  });

  it('Creator is a mainer',async function () {
    (await token.isMinter(creator)).should.equal(true);
  });

  it('Creator has 1 000 000 tokens',async function () {
    (await token.balanceOf(creator)).should.be.bignumber.equal(1000000 * Math.pow(10, 18));
  });

  it('Contract has 10 000 000 tokens',async function () {
    (await token.balanceOf(token.address)).should.be.bignumber.equal(10000000 * Math.pow(10, 18));
  });

  it('Mining is not finished',async function () {
    (await token.mintingFinished({ from: creator })).should.be.equal(false);
  });
  

});