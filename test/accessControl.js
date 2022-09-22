const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Access Control", async function() {

    async function initialStateFixture() {
        const A = await ethers.getContractFactory("A")
        const a = await upgrades.deployProxy(A, [10], {initializer: 'store'})
        const [owner, ...otherAccounts] = await ethers.getSigners()
        return {a, owner, otherAccounts}
    }
    
    it("should assign admin rights to deployer", async function() {
        const {a, owner} = await loadFixture(initialStateFixture)
        expect(await a.superAdmin()).to.be.equal(owner.address)
        expect(await a.isAdmin(owner.address)).to.be.true
    })

    describe("addAdmin", async function() {

        it("should add new admin", async function() {
            const {a,otherAccounts} = await loadFixture(initialStateFixture)
            const newAdmin = otherAccounts[0];
            await a.addAdmin(newAdmin.address);
            expect(await a.isAdmin(newAdmin.address)).to.be.true
        })

        it("should revert with proper error when called ay other account", async function() {
            const {a, owner, otherAccounts} = await loadFixture(initialStateFixture)
            const newAdmin = otherAccounts[0];
            const nonAdminAccount = otherAccounts[1];
            await expect(a.connect(nonAdminAccount).addAdmin(newAdmin.address)).to.be.revertedWith("Only superAdmin can perform this task.")
        }) 
    })
})