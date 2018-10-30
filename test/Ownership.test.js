const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();

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

  describe('Ownership.test.js', function () {

    it('After transfer ownership by contract owner to usual account, this usual account is new owner', async function () {

      //WHEN
      await token.transferOwnership(usualAccount, { from: owner });

      //THEN
      (await token.isOwner({ from: usualAccount })).should.be.equal(true);

    });

    it('After transfer ownership by contract owner to usual account, the adress of owner is changed to this usual account address', async function () {

      //WHEN
      await token.transferOwnership(usualAccount, { from: owner });

      //THEN
      (await token.owner({ from: owner })).should.be.equal(usualAccount);

    });


    it('After transfer ownership by contract owner to usual account, owner balance remains unchanged', async function () {

      //GIVEN
      var balance = await token.balanceOf(owner, { from: owner });

      //WHEN
      await token.transferOwnership(usualAccount, { from: owner });

      //THEN
      (await token.balanceOf(owner, { from: owner })).should.be.bignumber.equal(balance);

    });


    it('After renounce ownership by contract owner, he is not owner', async function () {

      //WHEN
      await token.renounceOwnership({ from: owner });

      //THEN
      (await token.isOwner({ from: owner })).should.be.equal(false);

    });


    it('After renounce ownership by contract owner, the new owner is zero address', async function () {

      //WHEN
      await token.renounceOwnership({ from: owner });

      //THEN
      (await token.owner({ from: owner })).should.be.equal(ZERO_ADDRESS);

    });


    it('After renounce ownership by contract owner, his balance remain unchanged', async function () {

      //GIVEN
      var balance = await token.balanceOf(creator, { from: owner });

      //WHEN
      await token.renounceOwnership({ from: owner });

      //THEN
      (await token.balanceOf(owner, { from: owner })).should.be.bignumber.equal(balance);

    });


    it('Owner can\'t burn from another account', async function () {

      //GIVEN
      var amount = 10000;
      await token.transfer(usualAccount, amount, { from: owner });

      //WHEN
      try {
        await token.burnFrom(usualAccount, amount, { from: owner });
      } catch (error) {

        //THEN
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });


    it('Owner can\'t burn from contract account', async function () {

      //GIVEN
      var amount = 10000;

      //WHEN
      try {
        await token.burnFrom(contract, amount, { from: owner });
      } catch (error) {

        //THEN
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });


    it('Owner can\'t transfer from contract account', async function () {

      //GIVEN
      var amount = 10000;

      //WHEN
      try {
        await token.transferFrom(contract, owner, amount, { from: owner });
      } catch (error) {

        //THEN
        error.message.should.include('revert', `Expected "revert", got ${error} instead`);
        return;
      }
      should.fail('Expected revert not received');

    });

    it('Owner can mint to contract account', async function () {

      //GIVEN
      var amount = 10000;
      var balance = (await token.balanceOf(contract, { from: owner }));

      //WHEN
      await token.mint(contract, amount, { from: owner });

      //THEN
      (await token.balanceOf(contract, { from: owner })).should.be.bignumber.equal(balance.add(amount));

    });

  });

});