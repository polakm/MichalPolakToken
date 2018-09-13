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


  //Po spaleniu tokenów przez podpalacza, jego saldo jest zmiejszony o ilość spalonych tokenów  
  it('After burn tokens by burner, his balance is reduced by amount of burned tokens',async function () {
   
    //GIVEN
    var burner = creator;
    var balance = (await token.balanceOf(burner, { from: burner }));
    var amount = 1000;

    //WHEN
    await token.burn(amount, { from: burner });
    
    //THEN
    (await token.balanceOf(burner, { from: burner })).should.be.bignumber.equal(balance.sub(amount));

  }); 


  // Palący nie może spalić ujemnej ilości tokenów 
  it('Burner can\'t burn a negative amount of tokens',async function () {
    
     //GIVEN
     var burner = creator;
     var amount = -99;
     
     //WHEN
     try { 
      await token.burn(amount, { from: burner });
      
      //THEN
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });


  // Po spaleniu tokenów z konta sponsora przez palącego, saldo sponsora zmniejsza się o ilość spalonych żetonów 
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

    // Po spaleniu tokenów z konta sponsora przez palącego, saldo palącego pozostaje bez zmian
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


  //Palący nie może spalić więcej tokenów z konta sponsora niż zatwierdzony przez sponsora przydział
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

  //Palący nie można spalić ujemnej ilości tokenów z konta sponsora 
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