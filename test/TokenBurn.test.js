const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils= require('web3-utils');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('MichalPolakToken', function ([_, creator,account1,account2]) {
  let token;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    token = await MichalPolakToken.new({ from: creator });
  });

  it('After burn tokens balance of reciever has burned number of tokens',async function () {
   
    var balance = (await token.balanceOf(creator));
    await token.burn(1000, { from: creator });
    (await token.balanceOf(creator)).should.be.bignumber.equal(balance.sub(1000));

  });

  it('Can\'t tranfer negative amount',async function () {
   
    var amount = -99;
    try { 
      await token.burn(amount, { from: creator });
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });

  it('burn from another address after allowance',async function () {
   
    //GIVEN
    var amount = 10000;
    var from = creator;
    var spender = account1;
    var to = account2;
    var balance = (await token.balanceOf(from));
    
    //WHEN
    await token.approve(spender, amount, { from: creator });
    await token.burnFrom(from, amount, { from: spender });

    //THEN
    (await token.balanceOf(from)).should.be.bignumber.equal(balance.sub(amount));

  });


  it('burn from another address after allowance',async function () {
   
    //GIVEN
    var amount = 10000;
    var from = creator;
    var spender = account1;
    var to = account2;

    //WHEN
    await token.approve(spender, amount, { from: creator });
    try { 
      await token.burnFrom(from, amount+1, { from: spender });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });

  it('Can\'t burn negative amount',async function () {
   
    //GIVEN
    var amount = 10000;
    var from = creator;
    var spender = account1;
    var to = account2;

    //WHEN
    await token.approve(spender, amount, { from: creator });
    try { 
      await token.burnFrom(from, -amount, { from: spender });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });



});