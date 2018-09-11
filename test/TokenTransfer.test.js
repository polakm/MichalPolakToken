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


  //Po przekazaniu tokenów bilans odbiorcy jest większy o daną kwotę
  it('After transferring tokens, the recipient\'s balance is increased by the amount specified',async function () {
    
    //GIVEN
    var amount = 99999999;
    var to = account1;
    (await token.balanceOf(to)).should.be.bignumber.equal(0);
    
    //WHEN
    await token.transfer(to, amount, { from: creator });

    //THEN
    (await token.balanceOf(to)).should.be.bignumber.equal(amount);

  });
  
  //Po przekazaniu tokenów bilans wysyłającego jest mniejszy o daną kwotę
  it('After transferring tokens, the sender\'s balance is decreased by the amount specified',async function () {
    
    //GIVEN
    var amount = 99999999;
    var to = account1;
    var balance = (await token.balanceOf(creator));
    
    //WHEN
    await token.transfer(to, amount, { from: creator });

    //THEN
    (await token.balanceOf(creator)).should.be.bignumber.equal(balance.sub(amount));

  });

    //Po przekazaniu tokenów podaż się nie zmienia
    it('After transferring tokens, the total supply is not changed', async function () {
    
      //GIVEN
      var amount = 99999999;
      var to = account1;
      var totalSupply = (await token.totalSupply({from:creator}));
      
      //WHEN
      await token.transfer(to, amount, { from: creator });
  
      //THEN
      (await token.totalSupply({from: creator})).should.be.bignumber.equal(totalSupply);
  
    });
    
  
    //Po przekazaniu tokenów ograniczenie podaży się nie zmienia
    it('After transferring tokens, the cap is not changed', async function () {
    
      //GIVEN
      var amount = 99999999;
      var to = account1;
      var cap = (await token.cap({from:creator}));
      
      //WHEN
      await token.transfer(to, amount, { from: creator });
  
      //THEN
      (await token.cap({from: creator})).should.be.bignumber.equal(cap);
  
    });


  //Po przekazaniu tokenów bilans odbiorcy jest większy o daną kwotę
  it('After try to transferring more tokens than you have shold revert',async function () {
    
    //GIVEN
    var amount = (await token.balanceOf(creator,{from: creator})).add(1);
    var to = account1;
    (await token.balanceOf(to)).should.be.bignumber.equal(0);
    
    //WHEN
    try { 
      await token.transfer(to, amount, { from: creator });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });
  
  //Nie można transferować ujemnych kwot
  it('Negative amounts can not be transferred',async function () {
   
    var amount = -1;
    var to = account1;
    try { 
      await token.transfer(to, amount, { from: creator });
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });


   it('Tranfer to zero address is blocked',async function () {
    
    //GIVEN
    var amount = 99999999;
    var to = ZERO_ADDRESS;
   
    try { 
      await token.transfer( to , amount, { from: creator });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });

  //Po zatwierdzeniu sponsora, spander  może przelać kwote z konta sponsora na inne konto
  it('After sponsor approve amount, spander can trasfer this amount from sponsor account to another account',async function () {
   
    //GIVEN
    var amount = 10000;
    var sponsor = creator;
    var spender = account1;
    var to = account2;
    await token.approve(spender, amount, { from: creator });
    
    //WHEN

    await token.transferFrom(sponsor, to , amount, { from: spender });

    //THEN
    (await token.balanceOf(to)).should.be.bignumber.equal(amount);

  });


  //Po zatwierdzeniu sponsora, spander nie może przenieść większej kwoty z konta sponsora na inne konto
  it('After sponsor approve amount, spander can\'t trasfer grather amount from sponsor account',async function () {
   
    //GIVEN
    var amount = 10000;
    var from = creator;
    var spender = account1;
    var to = account2;

    //WHEN
    await token.approve(spender, amount, { from: creator });
    try { 
      await token.transferFrom(from, to , amount+1, { from: spender });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });

  it('Spender can\'t transfer from sponsor account negative amount',async function () {
   
    //GIVEN
    var amount = 10000;
    var from = creator;
    var spender = account1;
    var to = account2;

    //WHEN
    await token.approve(spender, amount, { from: creator });
    try { 
      await token.transferFrom(from, to , -amount, { from: spender });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });

  it('Tranfer from sponsor account to zero address is blocked',async function () {
    
    //GIVEN
    var amount = 99999999;
    var from = creator;
    var to = ZERO_ADDRESS;
      
    try { 
      await token.transferFrom(from, to , amount, { from: creator });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });

  it('Transfer from zero addres to account is blocked',async function () {
    
    //GIVEN
    var amount = 99999999;
    var from = ZERO_ADDRESS;
    var to = account1;
      
    try { 
      await token.transferFrom(from, to , amount, { from: creator });
    } catch (error) {
     
       //THEN
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');

  });


      //Po przekazaniu tokenów przez spender podaż się nie zmienia
      it('After transferring tokens by spender, the total supply is not changed', async function () {
    
        //GIVEN
        var amount = 99999999;
        var from = creator;
        var spender = account1;
        var to = account2;
        var totalSupply = (await token.totalSupply({from:spender}));
      
        //WHEN
        await token.approve(spender, amount, { from: creator });
        await token.transferFrom(from, to , amount, { from: spender });
    
        //THEN
        (await token.totalSupply({from: spender})).should.be.bignumber.equal(totalSupply);
    
      });
      


      //Po przekazaniu tokenów przez spender ograniczenie podaży się nie zmienia
      it('After transferring tokens by spender, the cap is not changed', async function () {
      
        //GIVEN
        var amount = 99999999;
        var from = creator;
        var spender = account1;
        var to = account2;
        var cap = (await token.cap({from:spender}));
        
        //WHEN
        await token.approve(spender, amount, { from: creator });
        await token.transferFrom(from, to , amount, { from: spender });
    
        //THEN
        (await token.cap({from: spender})).should.be.bignumber.equal(cap);
    
      });

  
  it('Allowance for sponsor and spender is equal approved amount',async function () {
   
    //GIVEN
    var amount = 10000;
    var from = creator;
    var spender = account1;
    var to = account2;

    //WHEN
    await token.approve(spender, amount, { from: creator });

    //THEN
   (await token.allowance(from, spender, {from: account1})).should.be.bignumber.equal(10000);

  });

  


});