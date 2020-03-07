import { Contract, getDefaultProvider } from 'ethers';


const SmartContract = (contractAddress, abiPath) => {
  const contractAbi = require(abiPath);
  const provider = getDefaultProvider('homestead');
  return new Contract(contractAddress, contractAbi, provider);
};

export default SmartContract;
