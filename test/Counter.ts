import { Counter, Counter__factory } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("Counter")) as Counter__factory;
  const counterContract = (await factory.deploy()) as Counter;
  const counterContractAddress = await counterContract.getAddress();

  return { counterContract, counterContractAddress };
}

describe("Counter", function () {
  let signers: Signers;
  let counterContract: Counter;
  let counterContractAddress: Counter;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async () => {
    // Deploy a new instance of the contract before each test
    ({ counterContract, counterContractAddress } = await deployFixture());
  });

  it("should be deployed", async function () {
    console.log(`Counter has been deployed at address ${counterContractAddress}`);
    // Test the deployed address is valid
    expect(ethers.isAddress(counterContractAddress)).to.eq(true);
  });
  
    it("count should be zero after deployment", async function () {
    const count = await counterContract.getCount();
    console.log(`Counter.getCount() === ${count}`);
    // Expect initial count to be 0 after deployment
    expect(count).to.eq(0);
    });

    it("increment the counter by 1", async function () {
    const countBeforeInc = await counterContract.getCount();
    const tx = await counterContract.connect(signers.alice).increment(1);
    await tx.wait();
    const countAfterInc = await counterContract.getCount();
    expect(countAfterInc).to.eq(countBeforeInc + 1n);
    });


});