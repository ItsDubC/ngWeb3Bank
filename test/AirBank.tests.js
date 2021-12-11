const Usdc = artifacts.require("Usdc");
const Abrt = artifacts.require("Abrt");
const AirBank = artifacts.require("AirBank");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('AirBank', ([owner, customer]) => {
    let usdc, abrt, airBank;

    before(async () => {
        // Load contracts
        usdc = await Usdc.new();
        abrt = await Abrt.new();
        airBank = await AirBank.new(usdc.address, abrt.address);

        // Provision all ABRT tokens to AirBank
        await abrt.transfer(airBank.address, convertTokens('2000000'));

        // Distribute 100 USDC tokens to 2nd Ganache address (as user/staker)
        await usdc.transfer(customer, convertTokens('100'), { from: owner });
    });

    describe('Mock USDC deployment', async () => {
        it('matches name', async () => {
            const name = await usdc._name();
            assert.equal(name, 'Mock USDC');
        });

        it('matches symbol', async () => {
            const symbol = await usdc._symbol();
            assert.equal(symbol, 'mUSDC');
        })
    });

    describe('ABRT deployment', async () => {
        it('matches name', async () => {
            const name = await abrt._name();
            assert.equal(name, 'AirBank Reward Token');
        });

        it('matches symbol', async () => {
            const symbol = await abrt._symbol();
            assert.equal(symbol, 'ABRT');
        })
    });

    describe('AirBank Deployment', async() => {
        it('matches name', async () => {
            const name = await airBank._name();
            assert.equal(name, 'Air Bank');
        });

        it('contract has tokens', async() => {
            const tokenCount = await abrt._balanceOf(airBank.address);
            assert.equal(tokenCount, convertTokens('2000000'));
        })
    });

    describe('Yield farming', async() => {
        it('rewards tokens for staking', async() => {
            // Check investor balance
            let result = await usdc._balanceOf(customer);
            assert.equal(result.toString(), convertTokens('100'), 'customer USDC balance before staking');

            // Check staking for customer of 100 Mock USDC tokens
            await usdc.approve(airBank.address, convertTokens('100'), { from: customer });
            await airBank.stakeUsdcTokens(convertTokens('100'), { from: customer });

            // Check updated balance of customer
            result = await usdc._balanceOf(customer);
            assert.equal(result.toString(), convertTokens('0'), 'customer USDC balance after staking');

            // Check updated balance of Air Bank
            result = await usdc._balanceOf(airBank.address);
            assert.equal(result.toString(), convertTokens('100'), 'Air Bank USDC balance for customer after customer staked');

            // _isCurrentlyStaked update
            result = await airBank._isCurrentlyStaked(customer);
            assert.equal(result, true, 'customer staking status after staking');

            // Issue ABRT reward tokens
            await airBank.issueAbrtTokenRewards({ from: owner });

            // Ensure only owner can issue tokens
            await airBank.issueAbrtTokenRewards({ from: customer }).should.be.rejected;

            // Unstake tokens
            await airBank.unstakeAllUsdcTokens({ from: customer });

            // Check post-unstaking balances
            result = await airBank._stakedBalance(customer);
            assert.equal(result.toString(), 0, 'customer staked USDC balance should be 0');

            result = await usdc._balanceOf(customer);
            assert.equal(result.toString(), convertTokens('100'), 'customer USDC balance after unstaking should be 100 again');

            // Check updated balance of Air Bank
            result = await usdc._balanceOf(airBank.address);
            assert.equal(result.toString(), convertTokens('0'), 'Air Bank USDC balance after customer unstaked should be 0');

            // _isCurrentlyStaked update
            result = await airBank._isCurrentlyStaked(customer);
            assert.equal(result, false, 'customer _isCurrentlyStaked status after unstaking');
        });
    });

    // Helper functions
    let convertTokens = (number) => web3.utils.toWei(number, 'ether');
});