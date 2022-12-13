const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("Uniswap test contract", function () {
  var owner, addr1, addr2, impersonatedSigner;
        
  var Autofarm, hardhatAutofarm, autoFarmAddress, autoFarmContract;

  it("1) Impersonating as AutoFarm owner and set allocPoint of a pool", async function () {

    [owner, addr1, addr2] = await ethers.getSigners();
    Autofarm = await ethers.getContractFactory("Farm");
    hardhatAutofarm = await Autofarm.deploy();

    //var autoFarmAddress = "0x0895196562C7868C5Be92459FaE7f877ED450452";

    autoFarmAddress = "0x0895196562C7868C5Be92459FaE7f877ED450452";
    autoFarmContract = await hre.ethers.getContractAt("AutoFarmV2", autoFarmAddress);


    
    var autoOwner = await hardhatAutofarm.getOwner();

    await helpers.impersonateAccount(autoOwner);
    impersonatedSigner = await ethers.getSigner(autoOwner);

    //console.log(impersonatedSigner);

    var allocValue = await autoFarmContract.poolInfo(56);

    //console.log(allocValue);
    var pid = 56;
    var allocpoint = 1000;
    var booleanVal = false;
    var tx = await autoFarmContract.connect(impersonatedSigner).set(pid, allocpoint, booleanVal);
    const reciept2 = await tx.wait();

    poolInfo = await autoFarmContract.poolInfo(56);

    //console.log(poolInfo.allocPoint);


    expect(poolInfo.allocPoint).to.equal(allocpoint);
  });

  it("2) Transfering ownership to addr1.", async function () {

    var tx = await autoFarmContract.connect(impersonatedSigner).transferOwnership(addr1.address);
    const reciept2 = await tx.wait();

    //console.log(poolInfo.allocPoint);


    expect(await hardhatAutofarm.getOwner()).to.equal(addr1.address);
  });

  it("3) Checking total alloc points.", async function () {

    var totalAlloc = await autoFarmContract.totalAllocPoint();

    //console.log(totalAlloc);
    var pid = 56;
    var allocpoint = 0; // setting allocPoint of pool-56 to zero from 1000
    var booleanVal = false;
    var tx = await autoFarmContract.connect(impersonatedSigner).set(pid, allocpoint, booleanVal);
    const reciept2 = await tx.wait();

    expect(await autoFarmContract.totalAllocPoint()).to.equal((totalAlloc - 1000));
  });

  it("4) Check for owner",async function(){
    realOwner="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    var autoOwner = await hardhatAutofarm.getOwner();
    expect(autoOwner).to.equal(realOwner);
  })

  it("5. Checking AUTO token contract address.", async function () {

    var tokenAddress = await autoFarmContract.AUTO();
    var tx = await autoFarmContract.connect(impersonatedSigner).AUTO();
    expect(await autoFarmContract.AUTO()).to.equal("0x4508ABB72232271e452258530D4Ed799C685eccb");
  });

});
