// Contract address:  0x5FbDB2315678afecb367f032d93F642f64180aa3

// Decent Disc contract address:  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
// Token contract address:  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

const { ethers } = require("hardhat");
const hre = require("hardhat"); 

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether")
} 

const main = async () => {
  const name = "DecDisc"; 
  const symbol = "DDSC"; 

  const [deployer] = await ethers.getSigners(); 
  const contractFactory = await ethers.getContractFactory("DecentDisc"); 
  const contractFactory2 = await ethers.getContractFactory("DecentDiscToken"); 
  const decentDisc = await contractFactory.deploy(name, symbol); 
  await decentDisc.deployed();  

  const tokenContract = await contractFactory2.deploy(decentDisc.address, tokens(10)); 
  await tokenContract.deployed();  

  console.log('Decent Disc contract address: ', decentDisc.address); 
  console.log('Token contract address: ', tokenContract.address); 

  const channel_names = ["Intro", "General", "Showcase"]; 
  const cost = [tokens(0), tokens(1), tokens(2.5)]
  
  for(let i = 0; i < 3; i++){ 
    const tx = await decentDisc.connect(deployer).createChannel(channel_names[i], cost[i])
    await tx.wait(); 

    console.log("Created channel: ", channel_names[i]); 
  }
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();