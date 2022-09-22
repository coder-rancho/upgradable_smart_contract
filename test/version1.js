const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai")
const { ethers, upgrades } = require("hardhat")
const hre = require("hardhat")

describe("version 1", async function() {
    const initialValue  = 100

    async function initialStateFixture() {
        const A = await hre.ethers.getContractFactory("A")
        const a = await upgrades.deployProxy(A, [initialValue], {initializer: 'store'})
        const [owner, anotherAccount] = await ethers.getSigners();
        return {a, owner, anotherAccount}
    }

    it("should set value=" + initialValue, async function() {
        const {a} = await loadFixture(initialStateFixture)
        expect(await a.getter()).to.equal(initialValue)
    })


    describe("setter", async function() {
        const increment = 10

        it("should increment the value", async function() {
            const {a} = await loadFixture(initialStateFixture)
            await a.setter(increment)
            expect(await a.getter()).to.be.equal(initialValue + increment)
        })

        it("should revert with appropriate error when called by non-admin account", async function() {
            const {a, anotherAccount} = await loadFixture(initialStateFixture)
            await expect(a.connect(anotherAccount).setter(increment)).to.be.revertedWith("You're not admin.")
        })
    })

}) 