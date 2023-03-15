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
})