const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai")
const { ethers, upgrades } = require("hardhat")

describe("version 2", async function() {
    const initialValue = 10;
    const resetValue = 0;

    async function upgradableContractFixture() {
        // Deploying v1
        const A = await ethers.getContractFactory("A")
        const aV1 = await upgrades.deployProxy(A, [initialValue], {initializer: 'store'})

        const PROXY = aV1.address;

        // upgrading to v2
        const Av2 = await ethers.getContractFactory("Av2")
        const aV2 = await upgrades.upgradeProxy(PROXY, Av2)

        return {PROXY, aV2}
    }

    it("should preserve v1 address", async function() {
        const {PROXY, aV2} = await loadFixture(upgradableContractFixture)
        expect(aV2.address).to.be.equal(PROXY)
    })

    it("should preserve v1 state variables", async function() {
        const {aV2} = await loadFixture(upgradableContractFixture)
        expect(await aV2.getter()).to.be.equal(initialValue)
    })

    it("should add new functionalities of v2", async function() {
        const {aV2} = await loadFixture(upgradableContractFixture)
        await aV2.reset()
        expect(await aV2.getter()).to.be.equal(resetValue)
    })
})