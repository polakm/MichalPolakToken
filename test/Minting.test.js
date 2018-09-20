const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils = require('web3-utils');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('MichalPolakToken', function ([contractAccount, creator, account1]) {
  let token;
  let owner;
  let usualAccount;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    token = await MichalPolakToken.new({ from: creator });
    owner = creator;
    usualAccount = account1;
  });

  describe('Mining.test.js', function () {

    it('After minting tokens by contract owner for his account, his balance is increased by the amount of minted tokens', async function () {

      //GIVEN
      var amount = 1000;
      var balance = (await token.balanceOf(owner));

      //WHEN
      await token.mint(owner, amount, { from: owner });

      //THEN
      (await token.balanceOf(owner)).should.be.bignumber.equal(balance.add(amount));

    });


    it('Contract owner can\'t mint negative amount of tokens', async function () {

      //GIVEN
      var amount = -1000;

      //WHEN
      try {
        await token.mint(owner, amount, { from: owner });

        //THEN
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });


    it('Usual account with minter role, can\'t mint negative amount of tokens', async function () {

      //GIVEN
      var amount = -1000;
      await token.addMinter(usualAccount, { from: owner });

      //WHEN
      try {
        await token.mint(usualAccount, amount, { from: usualAccount });

        //THEN
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });


    it('Usual account without minter role, can\'t mint tokens', async function () {

      //GIVEN
      var amount = 1000;

      //WHEN
      try {
        await token.mint(usualAccount, amount, { from: usualAccount });

        //THEN
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });

    it('Usual account with minter role, can mint tokens for his account', async function () {

      //GIVEN
      var amount = 1000;
      var balance = (await token.balanceOf(usualAccount));
      await token.addMinter(usualAccount, { from: owner });

      //WHEN
      await token.mint(usualAccount, amount, { from: usualAccount });

      //THEN
      //if not fail is ok

    });


    it('After usual account with minter role, mint tokens for his account, his balance is increased by the amount of minted tokens', async function () {

      //GIVEN
      var balance = (await token.balanceOf(usualAccount));
      var amount = 1000;
      await token.addMinter(usualAccount, { from: owner });

      //WHEN
      await token.mint(usualAccount, amount, { from: usualAccount });

      //THEN
      (await token.balanceOf(usualAccount)).should.be.bignumber.equal(balance.add(amount));

    });


    it('After usual account renounce minter role, he can\'t mint tokens', async function () {

      //GIVEN
      var amount = 1000;
      await token.addMinter(usualAccount, { from: owner });
      await token.renounceMinter({ from: usualAccount });

      //WHEN
      try {
        await token.mint(usualAccount, amount, { from: usualAccount });

        //THEN
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });


    it('After contract owner renounce minter role, he can\'t mint tokens', async function () {

      //GIVEN
      var amount = 1000;
      await token.renounceMinter({ from: owner });

      //WHEN
      try {
        await token.mint(owner, amount, { from: owner });

        //THEN
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');
    });


    it('After usual account with minter role mint tokens to contract account, contract balance is incresed by amount of minted tokens', async function () {

      //GIVEN
      var amount = 10000;
      await token.addMinter(usualAccount, { from: owner });
      var balance = (await token.balanceOf(contractAccount, { from: usualAccount }));

      //WHEN
      await token.mint(contractAccount, amount, { from: usualAccount });
      //THEN
      (await token.balanceOf(contractAccount, { from: usualAccount })).should.be.bignumber.equal(balance.add(amount));

    });


    it('After finish minting by contract owner, minting is finished', async function () {

      //WHEN
      await token.finishMinting({ from: owner });

      //THEN
      (await token.mintingFinished({ from: owner })).should.be.equal(true);

    });


    it('After minting finished contract owner can\'t mint tokens', async function () {

      //GIVEN
      var amount = 100;
      await token.finishMinting({ from: owner });

      //WHEN
      try {
        await token.mint(owner, amount, { from: owner });

        //THEN 
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });


    it('After finish minting account with minter role can\'t mint tokens', async function () {

      //GIVEN
      var amount = 1000;
      await token.addMinter(usualAccount, { from: owner });
      await token.finishMinting({ from: owner });

      //WHEN
      try {
        await token.mint(usualAccount, amount, { from: usualAccount });

        //THEN
      } catch (error) {
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });

  });

});