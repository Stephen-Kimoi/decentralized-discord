// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
import "hardhat/console.sol";

contract DecentDiscToken is ERC20 {
    address public contractAddress; 

   constructor(address decentDisc, uint256 amount) ERC20("Decent Disc Token", "DDT"){
        _mint(decentDisc, 10000 * 10 ** 18);
        _transfer(decentDisc, address(this), amount);
    }
}