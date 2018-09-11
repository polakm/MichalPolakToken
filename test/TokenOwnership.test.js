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

  it('After transfer ownership account1 is owner',async function () {
   
    await token.transferOwnership( account1, {from:creator});

    (await token.isOwner({from: account1})).should.be.equal(true);

  });

  it('After transfer ownership owner is changed',async function () {
  
    await token.transferOwnership( account1, {from:creator});

    (await token.owner({from: creator})).should.be.equal(account1);
  
  });


  it('After transfer ownership owner balance is unchanged ',async function () {
   

    var balance =  await token.balanceOf(creator, {from:creator});
     
    await token.transferOwnership( account1, {from:creator});
 
     (await token.balanceOf(creator,{from: creator})).should.be.bignumber.equal(balance);
 
   });
 


  it('After renounce ownership creator is not owner',async function () {
   
    await token.renounceOwnership( {from:creator});

    (await token.isOwner({from: creator})).should.be.equal(false);

  });


  it('After renounce ownership owner is zero address',async function () {
   
    await token.renounceOwnership( {from:creator});

    (await token.owner({from: creator})).should.be.equal(ZERO_ADDRESS);

  });

  
  it('After renounce ownership owner balance is unchanged ',async function () {
   

   var balance =  await token.balanceOf(creator, {from:creator});
    
   await token.renounceOwnership( {from:creator});

    (await token.balanceOf(creator,{from: creator})).should.be.bignumber.equal(balance);

  });


});