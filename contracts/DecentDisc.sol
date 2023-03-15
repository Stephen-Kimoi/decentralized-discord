// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DecentDisc is ERC721 {
    address public owner;
    uint256 public channelNo; 

    struct Channel {
        uint256 id; 
        string name; 
        uint256 cost; 
    } 

    mapping (uint256 => Channel) public channels; 

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        // ERC721(_name, _symbol); 
        owner = msg.sender; 
    } 

    

    function createChannel(string memory name, uint256 cost) public {
        require(msg.sender == owner, "ERC721: Not owner of channel!"); 
        channelNo += 1; 
        channels[channelNo] = Channel(channelNo, name, cost); 
    }

    function getChannel(uint256 id) public view returns (Channel memory){
        return channels[id]; 
    }
}