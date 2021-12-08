pragma solidity ^0.8.0;

import './Usdc.sol';
import './Abrt.sol';

contract AirBank {
    string public _name = "Air Bank";
    address public _owner;

    Usdc public _usdc;
    Abrt public _abrt;

    address[] public _stakers;

    mapping(address => uint256) _stakedBalance;
    mapping(address => bool) _hasStaked;
    mapping(address => bool) _isCurrentlyStaked;

    constructor(Usdc usdc, Abrt abrt) {
        _usdc = usdc;
        _abrt = abrt;
        _owner = msg.sender;
    }

    function stakeUsdcTokens(uint256 amount) public {

    }

    function unstakeAllUsdcTokens() public {
        
    }

    function issueAbrtTokenRewards() public {

    }
}