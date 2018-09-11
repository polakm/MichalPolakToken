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

  it('After creator mint tokens balance of creator has bigger',async function () {
   
    var balance = (await token.balanceOf(creator));
    await token.mint(creator,1000, { from: creator });
    (await token.balanceOf(creator)).should.be.bignumber.equal(balance.add(1000));

  });


  it('After  creator try to mint negative amount should throw revert',async function () {
   
    try { 
      await token.mint(creator,-1000, { from: creator });

    } catch (error) {
    
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });


  it('After account1 try to mint and is not minter should throw revert',async function () {
   
    
    try { 
      await token.mint(account1,1000, { from: account1 });
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });

  it('After creator add account1 to minters, Account1 can mint tokens and balance of account1 has bigger',async function () {
   
    var balance = (await token.balanceOf(account1));
    await token.addMinter(account1,{ from: creator });
    await token.mint(account1,1000, { from: account1 });
    (await token.balanceOf(account1)).should.be.bignumber.equal(balance.add(1000));

  });


  it('After renounce minter account1 try to mint should throw revert',async function () {
   
    await token.addMinter(account1,{ from: creator });
    await token.renounceMinter({ from: account1 });
    try { 
      await token.mint(account1,1000, { from: account1 });
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });

  
  it('After renounce minter creator try to mint should throw revert',async function () {
   
    await token.renounceMinter({ from: creator });
    try { 
      await token.mint(creator,1000, { from: creator });
    } catch (error) {
      error.message.should.include('revert', `Expected "revert", got ${error} instead`);
      return;
    }
    should.fail('Expected revert not received');
  });

});