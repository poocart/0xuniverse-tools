const fs = require('fs');
const { Contract, getDefaultProvider } = require('ethers');


class SmartContract {
  constructor(contractAddress, abiName) {
    const contractAbi = fs.readFileSync(`${__dirname}/../abi/${abiName}.json`, 'utf8');
    const provider = getDefaultProvider('homestead');
    return new Contract(contractAddress, contractAbi, provider);
  }
}

module.exports = SmartContract;
