const { contracts_build_directory } = require('../truffle-config');

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
        airBank = await AirBank.nwe(usdc.address, abrt.address);

        // Provision all ABRT tokens to AirBank
        await abrt.transfer(airBank.address, convertTokens('2000000'));

        // Distribute 100 USDC tokens to 2nd Ganache address (as user/staker)
        await usdc.transfer(accounts[1], convertTokens('100'));
    })

    // Helper functions
    let convertTokens = (number) => web3.utils.toWei(number, 'ether');
});