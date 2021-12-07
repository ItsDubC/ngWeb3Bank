pragma solidity ^0.8.0;

contract Abrt {
    string public _name = 'AirBank Reward Token';
    string public _symbol = 'ABRT';
    uint256 public _totalSupply = 2000000000000000000000000; // 2 million tokens
    
    mapping(address => uint256) public _balanceOf;
    mapping(address => mapping(address => uint256)) public _allowance;

    constructor() {
        _balanceOf[msg.sender] = _totalSupply;
    }

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function transfer(address to, uint256 value) public returns (bool success) {
        require(_balanceOf[msg.sender] >= value);

        _balanceOf[msg.sender] -= value;
        _balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(_balanceOf[from] >= value);
        require(_allowance[from][msg.sender] >= value);

        _balanceOf[from] -= value;
        _balanceOf[to] += value;
        _allowance[msg.sender][from] -= value;

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        _allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);
        return true;
    }
}