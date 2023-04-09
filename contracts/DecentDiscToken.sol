// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

contract DecentDiscToken is ERC20 {
    constructor(address decentDisc) ERC20("Decent Disc Token", "DDT"){
        _mint(decentDisc, 10000 * 10 ** 18);
    }
}