import { ethers } from 'ethers';
import * as erc20json from '@openzeppelin/contracts/build/contracts/ERC20.json';

export function getDenomContract(provider: ethers.BrowserProvider, denom: string) {
  return new ethers.Contract(denom, erc20json.abi, provider);
}
