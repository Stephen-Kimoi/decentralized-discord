// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import './IDecentDiscToken.sol';

contract DecentDisc is ERC721 {
    IDecentDiscToken public token; 
    address public owner;
    uint256 public channelNo; 
    uint256 public mintedNFTs; 

    struct Channel {
        uint256 id; 
        string name; 
        uint256 cost; 
    } 

    mapping(uint256 => Channel) public channels; 
    mapping(uint256 => mapping(address => bool)) public joinedChannel; 

    constructor(address tokenAddress, string memory name, string memory symbol) ERC721(name, symbol) {
        // ERC721(_name, _symbol); 
        owner = msg.sender; 
        token = IDecentDiscToken(tokenAddress); 
        token.mint(address(this), 10000 * 10**18); 
    } 

    modifier onlyOwner {
        require(msg.sender == owner, "ERC721: Not owner of channel!"); 
        _; 
    }

    function mint(uint256 id) public payable {
        require(id != 0); 
        require(id <= channelNo); 
        require(joinedChannel[id][msg.sender] == false); 
        require(msg.value >= channels[id].cost); 

       joinedChannel[id][msg.sender] = true; 
       mintedNFTs++; 
       _safeMint(msg.sender, mintedNFTs); 
    }

    function createChannel(string memory name, uint256 cost) public onlyOwner {
        channelNo += 1; 
        channels[channelNo] = Channel(channelNo, name, cost); 
    }

    function getChannel(uint256 id) public view returns (Channel memory){
        return channels[id]; 
    }

    function sendTokens(address recipient, uint256 amount) public {
        require(token.balanceOf(address(this)) >= amount, "DecentDisc: Not enough tokens available");

        bool success = token.transfer(recipient, amount);
        require(success, "DecentDisc: Token transfer failed"); 
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}(""); 
        require(success); 
    }
}