const {expect} = require("chai"); 
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
} 

describe("DecentDisc", () => {
   let decentContract; 
   let NAME = 'DecDisc'; 
   let SYMBOL = "DDSC"; 
   let OWNER; 
   let ADDRESS1; 

   beforeEach( async () => {
        const [owner, address1] = await ethers.getSigners(); 
        OWNER = owner; 
        ADDRESS1 = address1; 

        const contractFactory = await ethers.getContractFactory("DecentDisc"); 
        decentContract = await contractFactory.deploy(NAME, SYMBOL); 

        const tx = await decentContract.connect(owner).createChannel("Web3 Devs", tokens(1)); 
        await tx.wait(); 
   })

   describe("deployment", () => {

      it("Should set the name", async() => { 
        let name = await decentContract.name(); 
        expect(name).to.equal(NAME); 
      })

      it("Should set the symbol", async() => { 
        let symbol = await decentContract.symbol(); 
        expect(symbol).to.equal(SYMBOL); 
      })

      it("Should set the owner of the contract", async () => {
        let owner = await decentContract.owner(); 
        expect(owner).to.equal(OWNER.address); 
      })

   })

   describe("Creating channels", () => {

       it("Returns total channels", async () => {
        const totalChannels = await decentContract.channelNo()
        expect(totalChannels).to.equal(1); 
       })

       it('Returns channel details', async () => {
        const channel = await decentContract.getChannel(1); 
        expect(channel.id).to.equal(1); 
        expect(channel.name).to.equal("Web3 Devs"); 
        expect(channel.cost).to.equal(tokens(1)); 
       })

   })

   describe("Joins channel", () => {
      const ID = 1; 
      const AMOUNT = ethers.utils.parseUnits("1", "ether"); 

      beforeEach( async() => {
        const tx = await decentContract.connect(ADDRESS1).mint(ID, {value: AMOUNT}); 
        await tx.wait(); 
      })

      it("Joined channel to be true", async () => {
        const result = await decentContract.joinedChannel(1, ADDRESS1.address); 
        expect(result).to.equal(true); 
      })

      it("Increases number of IDs", async () => {
        const result = await decentContract.mintedNFTs(); 
        expect(result).to.equal(ID); 
      })

      it("Contract balance increases", async () => {
        const result = await ethers.provider.getBalance(decentContract.address); 
        expect(result).to.equal(AMOUNT); 
      })

   })

   describe("WIthdrawing funds", async () => {
     const ID = 1; 
     const AMOUNT = ethers.utils.parseUnits("1", "ether"); 
     let balanceBefore; 

     beforeEach( async () => {
        balanceBefore = await ethers.provider.getBalance(OWNER.address); 
        let tx = await decentContract.connect(ADDRESS1).mint(ID, {value: AMOUNT}); 
        await tx.wait(); 

        tx = await decentContract.connect(OWNER).withdraw(); 
        await tx.wait(); 
     })

     it("Updates the owners balance", async () => {
        const balanceAfter = await ethers.provider.getBalance(OWNER.address); 
        expect(balanceAfter).to.greaterThan(balanceBefore); 
     })

     it("Updates contract balance", async () => {
        const result = await ethers.provider.getBalance(decentContract.address); 
        expect(result).to.equal(0)
     })
   })
})