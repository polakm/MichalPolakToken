const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils= require('web3-utils');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('MichalPolakToken', function ([contract, creator, account1,account2]) {
  let token;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    
    token = await MichalPolakToken.new({ from: creator });

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


  it('After burn tokens from sponsor account by burner, the sponsor balance is reduced by amount of burned tokens',async function () {
   
    //GIVEN
    var sponsor = creator;
    var burner = account1;
    var amount = 10000;
    var balance = (await token.balanceOf(sponsor,{ from: sponsor }));
    await token.approve(burner, amount, { from: sponsor });

    //WHEN
    await token.burnFrom(sponsor, amount, { from: burner });

    //THEN
    (await token.balanceOf(sponsor, { from: sponsor })).should.be.bignumber.equal(balance.sub(amount));

  });


  it('After burn tokens from sponsor account by burner, the burner account balance is not changed',async function () {
   
    //GIVEN
    var sponsor = creator;
    var burner = account1;
    var amount = 10000;
    await token.transfer(burner, amount, { from: sponsor });
    var balance = (await token.balanceOf(burner,{ from: burner }));
    await token.approve(burner, amount, { from: sponsor });
  
    //WHEN
    await token.burnFrom(sponsor, amount, { from: burner });
  
    //THEN
    (await token.balanceOf(burner, { from: burner })).should.be.bignumber.equal(balance);
  
  });


  it('Burner can\'t burn the more tokens from sponsor account than approved by sponsor allowance',async function () {
   
    //GIVEN
    var sponsor = creator;
    var burner = account1;
    var amount = 10000;
    await token.approve(burner, amount, { from: sponsor });

    //WHEN
    try { 
      await token.burnFrom(sponsor, amount+1, { from: burner });
    } catch (error) {
     
      //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });


  it('Burner can\'t burn a negative amount of tokens from sponsor account',async function () {
   
    //GIVEN
    var sponsor = creator;
    var burner = account1;
    var amount = 10000;
    await token.approve(burner, amount, { from: sponsor });
    
    //WHEN
    try { 
      await token.burnFrom(sponsor, -amount, { from: burner });
    } catch (error) {
     
      //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });



});