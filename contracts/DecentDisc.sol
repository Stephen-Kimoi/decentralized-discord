// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DecentDisc is ERC721 {
    address public owner; 

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        // ERC721(_name, _symbol); 
        owner = msg.sender; 
    } 
}