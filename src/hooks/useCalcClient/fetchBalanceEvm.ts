import { ethers } from 'ethers';
import * as erc20json from '@openzeppelin/contracts/build/contracts/ERC20.json';

export async function fetchBalanceEvm(tokenId: string, provider: ethers.BrowserProvider, address: string) {
  const erc20 = new ethers.Contract(tokenId, erc20json.abi, provider);

  const supplyResult = await erc20.balanceOf(address);

  const amount = supplyResult.toString();
  return {
    amount,
    denom: tokenId,
  };
}
