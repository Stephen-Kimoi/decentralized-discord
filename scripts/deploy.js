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
  const decentDisc = await contractFactory.deploy(); 
  await decentDisc.deployed();  

  console.log('Contract address: ', decentDisc.address); 

  const channel_names = ["Intro", "General", "Showcase"]; 
  const cost = [tokens(0), tokens(1), tokens(2.5)]
  
  for(let i = 0; i < 3; i++){ 
    const tx = await decentDisc.connect(deployer).createChannel(channel_names[i], cost[i])
    await tx.wait(); 

    console.log("Created channel: ", channel_names[i]); 
  }
}