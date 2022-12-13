async function main() {  
    const MyBSCTestnet = await ethers.getContractFactory("Farm");     
    const MyBSCTestnetContract = await MyBSCTestnet.deploy();
    console.log("Contract deployed to address:",MyBSCTestnetContract.address);
  }
  main().then(() => 
    process.exit(0)
  ).catch((error) => {        
     console.log(error);    
     process.exit(1);  
  });
