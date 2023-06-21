import { ContractRunner, ethers } from 'ethers';
import * as erc20json from '@openzeppelin/contracts/build/contracts/ERC20.json';

export function getDenomContract(contractRunner: ContractRunner, denom: string) {
  return new ethers.Contract(denom, erc20json.abi, contractRunner);
}
