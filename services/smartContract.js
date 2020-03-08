const { Contract, getDefaultProvider } = require('ethers');


class SmartContract {
  constructor(contractAddress, abiName) {
    const contractAbi = require(`${__dirname}/../abi/${abiName}.json`);
    const provider = getDefaultProvider('homestead');
    return new Contract(contractAddress, contractAbi, provider);
  }
}

module.exports = SmartContract;
