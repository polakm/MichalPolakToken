const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils = require('web3-utils');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('MichalPolakToken', function ([_, creator, account1, account2]) {
    let token;

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    beforeEach(async function () {
        token = await MichalPolakToken.new({ from: creator });
    });


    it('After sponsor approve amount, spander can trasfer this amount from sponsor account to another account', async function () {

        //GIVEN
        var amount = 10000;
        var sponsor = creator;
        var spender = account1;
        var to = account2;
        await token.approve(spender, amount, { from: creator });

        //WHEN
        await token.transferFrom(sponsor, to, amount, { from: spender });

        //THEN
        (await token.balanceOf(to)).should.be.bignumber.equal(amount);

    });

    it('After sponsor approve amount, spander can\'t trasfer grather amount from sponsor account', async function () {

        //GIVEN
        var amount = 10000;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        try {
            await token.transferFrom(from, to, amount + 1, { from: spender });
        } catch (error) {

            //THEN
            error.message.should.include('revert', `Expected "revert", got ${error} instead`);
            return;
        }
        should.fail('Expected revert not received');

    });

    it('Spender can\'t transfer from sponsor account negative amount', async function () {

        //GIVEN
        var amount = 10000;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        try {
            await token.transferFrom(from, to, -amount, { from: spender });
        } catch (error) {

            //THEN
            error.message.should.include('revert', `Expected "revert", got ${error} instead`);
            return;
        }
        should.fail('Expected revert not received');

    });

    it('Tranfer from sponsor account to zero address is blocked', async function () {

        //GIVEN
        var amount = 99999999;
        var from = creator;
        var to = ZERO_ADDRESS;

        try {
            await token.transferFrom(from, to, amount, { from: creator });
        } catch (error) {

            //THEN
            error.message.should.include('revert', `Expected "revert", got ${error} instead`);
            return;
        }
        should.fail('Expected revert not received');

    });

    it('Transfer from zero addres to account is blocked', async function () {

        //GIVEN
        var amount = 99999999;
        var from = ZERO_ADDRESS;
        var to = account1;

        try {
            await token.transferFrom(from, to, amount, { from: creator });
        } catch (error) {

            //THEN
            error.message.should.include('revert', `Expected "revert", got ${error} instead`);
            return;
        }
        should.fail('Expected revert not received');

    });


    it('After transferring tokens by spender, the total supply is not changed', async function () {

        //GIVEN
        var amount = 99999999;
        var from = creator;
        var spender = account1;
        var to = account2;
        var totalSupply = (await token.totalSupply({ from: spender }));

        //WHEN
        await token.approve(spender, amount, { from: creator });
        await token.transferFrom(from, to, amount, { from: spender });

        //THEN
        (await token.totalSupply({ from: spender })).should.be.bignumber.equal(totalSupply);

    });


    it('After transferring tokens by spender, the cap is not changed', async function () {

        //GIVEN
        var amount = 99999999;
        var from = creator;
        var spender = account1;
        var to = account2;
        var cap = (await token.cap({ from: spender }));

        //WHEN
        await token.approve(spender, amount, { from: creator });
        await token.transferFrom(from, to, amount, { from: spender });

        //THEN
        (await token.cap({ from: spender })).should.be.bignumber.equal(cap);

    });


    it('Allowance for sponsor and spender is equal approved amount', async function () {

        //GIVEN
        var amount = 10000;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });

        //THEN
        (await token.allowance(from, spender, { from: account1 })).should.be.bignumber.equal(10000);

    });


    it('After incresee for sponsor and spender is equal approved amount', async function () {

        //GIVEN
        var amount = 10000;
        var increaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.increaseAllowance(spender, increaseValue, { from: creator }));

        //THEN
        (await token.allowance(from, spender, { from: account1 })).should.be.bignumber.equal(10000 + 100);

    });

    it('After incresee for sponsor and spender is equal approved amount', async function () {

        //GIVEN
        var amount = 10000;
        var increaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.increaseAllowance(spender, increaseValue, { from: creator }));
        //THEN

        (await token.allowance(from, spender, { from: account1 })).should.be.bignumber.equal(10000 + increaseValue);

    });


    it('After incresee by sponsor allwoance, spender can spend incresed amount', async function () {

        //GIVEN
        var amount = 10000;
        var increaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.increaseAllowance(spender, increaseValue, { from: creator }));

        //THEN
        (await token.transferFrom(from, spender, amount + increaseValue, { from: account1 }))
    });


    it('After decresee for sponsor and spender is equal approved amount', async function () {

        //GIVEN
        var amount = 10000;
        var decreaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.decreaseAllowance(spender, decreaseValue, { from: creator }));
        //THEN

        (await token.allowance(from, spender, { from: account1 })).should.be.bignumber.equal(10000 - 100);

    });


    it('After decresee for sponsor and spender is equal approved amount', async function () {

        //GIVEN
        var amount = 10000;
        var decreaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.decreaseAllowance(spender, decreaseValue, { from: creator }));
        //THEN

        (await token.allowance(from, spender, { from: account1 })).should.be.bignumber.equal(10000 - 100);

    });

    it('After decresee by sponsor allwoance, spender can spend incresed amount', async function () {

        //GIVEN
        var amount = 10000;
        var decreaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.decreaseAllowance(spender, decreaseValue, { from: creator }));

        (await token.transferFrom(from, spender, amount - decreaseValue, { from: account1 }))
    });


    it('After decresee by sponsor and spender can\'t spend the initial approved amount', async function () {

        //GIVEN
        var amount = 10000;
        var decreaseValue = 100;
        var from = creator;
        var spender = account1;
        var to = account2;

        //WHEN
        await token.approve(spender, amount, { from: creator });
        (await token.decreaseAllowance(spender, decreaseValue, { from: creator }));

        try {
            (await token.transferFrom(from, to, amount, { from: account1 }))
        } catch (error) {

            //THEN
            error.message.should.include('revert', `Expected "revert", got ${error} instead`);
            return;
        }
        should.fail('Expected revert not received');
    });
    
});