pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";



contract MichalPolakToken is ERC20, ERC20Detailed, ERC20Capped, ERC20Burnable, Ownable {
  
    string public constant TOKEN_NAME = "Michal Polak Token";
    string public constant TOKEN_SYMBOL = "MPT";
    uint8 public constant TOKEN_DECIMALS = 18;
    
    uint256 public constant OWNER_SUPPLY = 1000000 * (10 ** uint256(TOKEN_DECIMALS));
    uint256 public constant INITIAL_SUPPLY = 10000000 * (10 ** uint256(TOKEN_DECIMALS));
    uint256 public constant CAP = 21000000 * (10 ** uint256(TOKEN_DECIMALS));
    
    uint256 public minerLicenses;
    
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    constructor() public
        ERC20()
        ERC20Detailed(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS) 
        ERC20Capped(CAP) 
        ERC20Burnable()
        Ownable() {
       
        addMinter(address(this));
        _mint(address(this), INITIAL_SUPPLY);
        
        addMinter(msg.sender);
        _mint(msg.sender, OWNER_SUPPLY);
    }
    

    function buyMinerLicense () public payable {
      
        addMinter(msg.sender);
        minerLicenses++;
    }
    
    function transferMinerLicence (address _to) public{
       
        renounceMinter(); 
        addMinter(_to);
    }
}