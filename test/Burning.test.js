const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils= require('web3-utils');
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


  it('After burn tokens by contract owner, his balance is reduced by amount of burned tokens',async function () {
   
    //GIVEN
    var amount = 1000;
    var balance = (await token.balanceOf(owner, { from: owner }));

    //WHEN
    await token.burn(amount, { from: owner });
    
    //THEN
    (await token.balanceOf(owner, { from: owner })).should.be.bignumber.equal(balance.sub(amount));

  }); 


  it('Contract owner can\'t burn a negative amount of tokens',async function () {
    
     //GIVEN
     var amount = -99;
     
     //WHEN
     try { 
      await token.burn(amount, { from: owner });
      
      //THEN
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });


  it('After burn tokens from contract owner account by approved usual account, the owner balance is reduced by amount of burned tokens',async function () {
   
    //GIVEN
    var amount = 10000;
    var balance = (await token.balanceOf(owner, { from: owner }));
    await token.approve(usualAccount, amount, { from: owner });

    //WHEN
    await token.burnFrom(owner, amount, { from: usualAccount });

    //THEN
    (await token.balanceOf(owner, { from: owner })).should.be.bignumber.equal(balance.sub(amount));

  });


  it('After burn tokens from conract owner account by approved usual account, the usual account balance remains unchanged',async function () {
   
    //GIVEN
    var owner = creator;
    var amount = 10000;
    await token.transfer(usualAccount, amount, { from: owner });
    var balance = (await token.balanceOf(usualAccount,{ from: usualAccount }));
    await token.approve(usualAccount, amount, { from: owner });
  
    //WHEN
    await token.burnFrom(owner, amount, { from: usualAccount });
  
    //THEN
    (await token.balanceOf(usualAccount, { from: usualAccount })).should.be.bignumber.equal(balance);
  
  });


  it('Approved usual account can\'t burn the more tokens from contract owner account than allowance approved by owner',async function () {
   
    //GIVEN
    var approvedAmount = 10000;
    var amountToBurn = approvedAmount+1;
    await token.approve(usualAccount, approvedAmount, { from: owner });
   
    //WHEN
    try { 
      await token.burnFrom(owner, amountToBurn, { from: usualAccount });
    } catch (error) {
     
      //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });


  it('Approved usual account can\'t burn a negative amount of tokens from contract owner account',async function () {
   
    //GIVEN
    var approvedAmount = 10000;
    var amountToBurn = -10000;
    await token.approve(usualAccount, approvedAmount, { from: owner });
    
    //WHEN
    try { 
      await token.burnFrom(owner, amountToBurn, { from: usualAccount });
    } catch (error) {
     
      //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });



});