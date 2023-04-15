// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
import "hardhat/console.sol";

contract DecentDiscToken is ERC20 {

   constructor() ERC20("Decent Disc Token", "DDT"){
      uint256 initialSupply = 1000; 
      _mint(msg.sender, initialSupply); 
    } 

    function mint(address to, uint256 amount) public {
        // require(msg.sender == address(this), "Only the DecentDisc contract can mint tokens."); 
        _mint(to, amount); 
    }
}