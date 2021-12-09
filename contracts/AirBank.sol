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
        require(amount > 0, 'Amount must be greater than 0');

        _usdc.transferFrom(msg.sender, address(this), amount);

        _stakedBalance[msg.sender] += amount;

        if (!_hasStaked[msg.sender]) {
            _stakers.push(msg.sender);
        }

        _hasStaked[msg.sender] = true;
        _isCurrentlyStaked[msg.sender] = true;
    }

    function unstakeAllUsdcTokens() public {
        uint256 stakedBalance = _stakedBalance[msg.sender];

        require(stakedBalance > 0, 'No mUSDC balance to unstake');

        _usdc.transfer(msg.sender, stakedBalance);

        _stakedBalance[msg.sender] = 0;
        _isCurrentlyStaked[msg.sender] = false;
    }

    function issueAbrtTokenRewards() public {
        require(msg.sender == _owner, 'Only AirBank can issue ABRT reward tokens');

        // Reward 5% staked amount
         
    }
}