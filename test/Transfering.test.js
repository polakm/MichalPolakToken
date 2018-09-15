const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils = require('web3-utils');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('MichalPolakToken', function ([contract, creator, usualAccount]) {
  let token, owner;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    token = await MichalPolakToken.new({ from: creator });
    owner = creator;
  });


  it('After transfer tokens by contract owner to usual account, the usual account balance is increased by the amount of tranfered tokens', async function () {

    //GIVEN
    var amount = 99999999;
   var balance = (await token.balanceOf(usualAccount, { from: owner }));

    //WHEN
    await token.transfer(usualAccount, amount, { from: owner });

    //THEN
    (await token.balanceOf(usualAccount, { from: owner })).should.be.bignumber.equal(balance.add(amount));

  });


  it('After transfer tokens by contract owner to usual account, the owner\'s balance is decreased by the amount of tranfered tokens', async function () {

    //GIVEN
    var amount = 99999999;
    var balance = await token.balanceOf(owner, { from: creator });

    //WHEN
    await token.transfer(usualAccount, amount, { from: owner });

    //THEN
    (await token.balanceOf(owner, { from: owner })).should.be.bignumber.equal(balance.sub(amount));

  });


  it('After transferring tokens by contract owner to usual account, the total supply remain unchanged', async function () {

    //GIVEN
    var amount = 99999999;
    var totalSupply = (await token.totalSupply({ from: owner }));

    //WHEN
    await token.transfer(usualAccount, amount, { from: owner });

    //THEN
    (await token.totalSupply({ from: owner })).should.be.bignumber.equal(totalSupply);

  });


  it('After transferring tokens by contract owner to usual account, the cap remain unchanged', async function () {

    //GIVEN
    var amount = 99999999;
    var cap = (await token.cap({ from: owner }));

    //WHEN
    await token.transfer(usualAccount, amount, { from: owner });

    //THEN
    (await token.cap({ from: owner })).should.be.bignumber.equal(cap);

  });


  it('Contract owner can\'t tranfer more amount of tokens than he has', async function () {

    //GIVEN
    var amount = (await token.balanceOf(owner, { from: owner })).add(1);
    (await token.balanceOf(usualAccount, { from: owner })).should.be.bignumber.equal(0);

    //WHEN
    try {
      await token.transfer(usualAccount, amount, { from: owner });
    } catch (error) {

      //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });


  it('Contract owner can\'t transfer negative amounts of tokens', async function () {

    //GIVEN
    var amount = -1;
    //WHEN
    try {
      await token.transfer(usualAccount, amount, { from: owner });

      //THEN
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });


  it('Contract owner can\'t transfer to zero address', async function () {

    //GIVEN
    var amount = 99999999;

    try {
      await token.transfer(ZERO_ADDRESS, amount, { from: owner });
    } catch (error) {

      //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });

});