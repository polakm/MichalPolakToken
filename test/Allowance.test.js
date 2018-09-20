const MichalPolakToken = artifacts.require('MichalPolakToken');
const Web3 = require('web3');
var web3 = new Web3();
web3.utils = require('web3-utils');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('MichalPolakToken', function ([_, creator, usualAccount, otherUsualAccount]) {
    let token, owner;

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    beforeEach(async function () {
        token = await MichalPolakToken.new({ from: creator });
        owner = creator;
    });

    describe('Allowance.test.js', function () {

        it('After approved usual account trasfer from owner account aprroved amount to other account, balance of this account is incresed by trasfered amount', async function () {

            //GIVEN
            var amount = 10000;
            await token.approve(usualAccount, amount, { from: owner });
            var balance = (await token.balanceOf(otherUsualAccount, { from: owner }));

            //WHEN
            await token.transferFrom(owner, otherUsualAccount, amount, { from: usualAccount });

            //THEN
            (await token.balanceOf(otherUsualAccount)).should.be.bignumber.equal(balance.add(amount));

        });

        it('Approved usual account can\'t trasfer more tokens from owner account than approved by owner amount', async function () {

            //GIVEN
            var approvedAmout = 10000;
            var amountToTranfer = approvedAmout + 1

            //WHEN
            await token.approve(usualAccount, approvedAmout, { from: owner });
            try {
                await token.transferFrom(owner, otherUsualAccount, amountToTranfer, { from: usualAccount });
            } catch (error) {

                //THEN
                error.message.should.include('revert', `Expected "revert", got ${error} instead`);
                return;
            }
            should.fail('Expected revert not received');

        });

        it('Approved usual account can\'t transfer from owner account to other usual account the negative amount of tokens', async function () {

            //GIVEN
            var amount = 10000;

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            try {
                await token.transferFrom(owner, otherUsualAccount, -amount, { from: usualAccount });
            } catch (error) {

                //THEN
                error.message.should.include('revert', `Expected "revert", got ${error} instead`);
                return;
            }
            should.fail('Expected revert not received');

        });

        it('Approved usuaual acount can\'t tranfer from owner account to zero address', async function () {

            //GIVEN
            var amount = 99999999;

            try {
                await token.transferFrom(owner, ZERO_ADDRESS, amount, { from: owner });
            } catch (error) {

                //THEN
                error.message.should.include('revert', `Expected "revert", got ${error} instead`);
                return;
            }
            should.fail('Expected revert not received');

        });

        it('Usual account can\'t transfer from zero address to other usual account', async function () {

            //GIVEN
            var amount = 99999999;

            try {
                await token.transferFrom(ZERO_ADDRESS, usualAccount, amount, { from: owner });
            } catch (error) {

                //THEN
                error.message.should.include('revert', `Expected "revert", got ${error} instead`);
                return;
            }
            should.fail('Expected revert not received');

        });


        it('After approved usual account transfer tokens from owner account to other usual account, the total supply remains unchanged', async function () {

            //GIVEN
            var amount = 99999999;
            var totalSupply = (await token.totalSupply({ from: usualAccount }));

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            await token.transferFrom(owner, otherUsualAccount, amount, { from: usualAccount });

            //THEN
            (await token.totalSupply({ from: usualAccount })).should.be.bignumber.equal(totalSupply);

        });


        it('After approved usual account trasfer tokens form owner account to other usual account, the cap remains unchanged', async function () {

            //GIVEN
            var amount = 99999999;
            var cap = (await token.cap({ from: usualAccount }));

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            await token.transferFrom(owner, otherUsualAccount, amount, { from: usualAccount });

            //THEN
            (await token.cap({ from: usualAccount })).should.be.bignumber.equal(cap);

        });


        it('After contract owner account approve ammount for usual account, allowance for this account is equal approved amount', async function () {

            //GIVEN
            var amount = 10000;

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });

            //THEN
            (await token.allowance(owner, usualAccount, { from: usualAccount })).should.be.bignumber.equal(10000);

        });


        it('After contract owner account incresee allowance for approved other account, his allowance is equal sum of approved before amount and increased value', async function () {

            //GIVEN
            var amount = 10000;
            var increaseValue = 100;
            var expectedAllowance = amount + increaseValue

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            (await token.increaseAllowance(usualAccount, increaseValue, { from: owner }));
            //THEN

            (await token.allowance(owner, usualAccount, { from: usualAccount })).should.be.bignumber.equal(expectedAllowance);

        });


        it('After cotract owner account incresee allowance for usual account, usual account can trasfer the increased allowance to other account', async function () {

            //GIVEN
            var amount = 10000;
            var increaseValue = 100;
            var increasedAllowance = amount + increaseValue;

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            (await token.increaseAllowance(usualAccount, increaseValue, { from: owner }));

            //THEN
            (await token.transferFrom(owner, usualAccount, increasedAllowance, { from: usualAccount }))
        });


        it('After contract owner account decresee allowance for usual account, allowance of this account is equal difference of approved before amount and decreased value', async function () {

            //GIVEN
            var amount = 10000;
            var decreaseValue = 100;
            var expectedAllowance = amount - decreaseValue;
            await token.approve(usualAccount, amount, { from: owner });

            //WHEN
            (await token.decreaseAllowance(usualAccount, decreaseValue, { from: owner }));
            //THEN

            (await token.allowance(owner, usualAccount, { from: usualAccount })).should.be.bignumber.equal(10000 - 100);

        });


        it('After contract owner account decresee allowance for usual account, allowance of this account is equal difference of approved before amount and decreased value', async function () {

            //GIVEN
            var amount = 10000;
            var decreaseValue = 100;
            await token.approve(usualAccount, amount, { from: owner });

            //WHEN
            (await token.decreaseAllowance(usualAccount, decreaseValue, { from: owner }));
            //THEN

            (await token.allowance(owner, usualAccount, { from: usualAccount })).should.be.bignumber.equal(10000 - 100);

        });

        it('After contract owner account decrease allwoance for approved usual account,the usual account can spend incresed amount', async function () {

            //GIVEN
            var amount = 10000;
            var decreaseValue = 100;
            var decreasedAmout = amount - decreaseValue

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            (await token.decreaseAllowance(usualAccount, decreaseValue, { from: owner }));

            //THEN
            (await token.transferFrom(owner, usualAccount, decreasedAmout, { from: usualAccount }))
        });


        it('After contract owner account decrease allowance for approved usual account,the usual account can\'t spend the before approved amount', async function () {

            //GIVEN
            var amount = 10000;
            var decreaseValue = 100;

            //WHEN
            await token.approve(usualAccount, amount, { from: owner });
            (await token.decreaseAllowance(usualAccount, decreaseValue, { from: owner }));

            try {
                (await token.transferFrom(owner, otherUsualAccount, amount, { from: usualAccount }))
            } catch (error) {

                //THEN
                error.message.should.include('revert', `Expected "revert", got ${error} instead`);
                return;
            }
            should.fail('Expected revert not received');
        });

    });

});