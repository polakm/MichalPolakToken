pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";



contract MichalPolakToken is ERC20, ERC20Detailed, ERC20Capped, ERC20Burnable, Ownable {
  
    string  constant TOKEN_NAME = "Michal Polak Token";
    string  constant TOKEN_SYMBOL = "MPT";
    uint8  constant TOKEN_DECIMALS = 18;
    
    uint256  constant OWNER_SUPPLY = 1000000 * (10 ** uint256(TOKEN_DECIMALS));
    uint256  constant INITIAL_SUPPLY = 10000000 * (10 ** uint256(TOKEN_DECIMALS));
    uint256  constant CAP = 21000000 * (10 ** uint256(TOKEN_DECIMALS));
        
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    constructor() public
        ERC20()
        ERC20Detailed(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS) 
        ERC20Capped(CAP) 
        ERC20Burnable()
        Ownable() {
       
        _mint(address(this), INITIAL_SUPPLY);
        _mint(msg.sender, OWNER_SUPPLY);
    }    

}