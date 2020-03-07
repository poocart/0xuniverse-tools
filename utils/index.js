import { utils } from 'ethers/ethers';


export const parseContractAmount = (value) => Number(utils.formatUnits(value.toString(), 0));
