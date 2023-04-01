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
  
  for(let i = 0; i < 3; i++){ 
    
  }
}