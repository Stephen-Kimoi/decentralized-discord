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
  const tokenContract = await contractFactory2.deploy(); 
  await tokenContract.deployed();  

  const decentDisc = await contractFactory.deploy(tokenContract.address ,name, symbol); 
  await decentDisc.deployed();  

  const owner = await decentDisc.owner(); 

  console.log('Decent Disc contract address: ', decentDisc.address); 
  console.log('Token contract address: ', tokenContract.address); 
  console.log('Deployer address: ', owner); 

  const channel_names = ["Intro", "General", "Showcase", "Developers", "Techincal Writers", "Jobs", "Hire"]; 
  const cost = [tokens(0), tokens(0.00004), tokens(0.00002), tokens(0.00003), tokens(0.0004), tokens(0.000001), tokens(0.00004)]
  
  for(let i = 0; i < 7; i++){ 
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

// POLYGON MUMBAI DEPLOY 

// Decent Disc contract address:  0x3a5b855aEcfaDAAe124DCee6dDfCCc04b5B88be8
// Token contract address:  0x84551B09B71c8a711019e0D674C22822E9Bd3Cdc
// Deployer address:  0x13Ef924EB7408e90278B86b659960AFb00DDae61

// Decent Disc contract address:  0xF19874a8226CF7aD444D60F80Ed382A72e5a4d9B
// Token contract address:  0x51AeCDFEd1c69A6cC45925bFcf7b2697a06e2551
// Deployer address:  0x13Ef924EB7408e90278B86b659960AFb00DDae61

// Decent Disc contract address:  0xfb3a31A7A8f0b2B125358cDa447Ff7108aCA49EC
// Token contract address:  0x324889eF709Bd3F8583857c9509C994007765393
// Deployer address:  0x13Ef924EB7408e90278B86b659960AFb00DDae61

// Decent Disc contract address:  0x4C18d3a1B249d363916055759020ed2672ed8dcE
// Token contract address:  0x1ad9d4269E0Ce5b4c30483244c261F31fbD5b6f5
// Deployer address:  0x13Ef924EB7408e90278B86b659960AFb00DDae61

// Contract address:  0x5FbDB2315678afecb367f032d93F642f64180aa3

// Decent Disc contract address:  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
// Token contract address:  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

// Decent Disc contract address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
// Token contract address:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

// Decent Disc contract address:  0x0B306BF915C4d645ff596e518fAf3F9669b97016
// Token contract address:  0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1
// Deployer address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// Decent Disc contract address:  0xc6e7DF5E7b4f2A278906862b61205850344D4e7d
// Token contract address:  0x59b670e9fA9D0A427751Af201D676719a970857b
// Deployer address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// Decent Disc contract address:  0x7a2088a1bFc9d81c55368AE168C2C02570cB814F
// Token contract address:  0x4A679253410272dd5232B3Ff7cF5dbB88f295319
// Deployer address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// Decent Disc contract address:  0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690
// Token contract address:  0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E
// Deployer address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// Decent Disc contract address:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// Token contract address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
// Deployer address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// Decent Disc contract address:  0x0165878A594ca255338adfa4d48449f69242Eb8F
// Token contract address:  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
// Deployer address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266