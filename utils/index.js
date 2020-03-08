const { utils } = require('ethers/ethers');


const parseContractAmount = (value) => Number(utils.formatUnits(value.toString(), 0));

module.exports = {
  parseContractAmount,
};
