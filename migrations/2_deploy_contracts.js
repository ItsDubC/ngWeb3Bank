const Usdc = artifacts.require('Usdc');
const Abrt = artifacts.require('Abrt');
const AirBank = artifacts.require('AirBank');

module.exports = async function(deployer, network, accounts) {
    // Deploy contracts
    await deployer.deploy(Usdc);
    const usdc = await Usdc.deployed();

    await deployer.deploy(Abrt);
    const abrt = await Abrt.deployed();

    await deployer.deploy(AirBank, usdc.address, abrt.address);
    const airBank = await AirBank.deployed();

    // Provision all ABRT tokens to AirBank
    await abrt.transfer(airBank.address, '2000000000000000000000000');

    // Distribute 100 USDC tokens to 2nd Ganache address (as user/staker)
    await usdc.transfer(accounts[1], '100000000000000000000');
}