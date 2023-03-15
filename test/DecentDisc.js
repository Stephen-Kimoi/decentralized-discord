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
})