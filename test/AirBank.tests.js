const Usdc = artifacts.require("Usdc");
const Abrt = artifacts.require("Abrt");
const AirBank = artifacts.require("AirBank");

require('chai')
    .use(require('chai-as-promised'))
    .should();