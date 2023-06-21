import { ethers } from 'ethers';
import { getDenomContract } from '../../interfaces/evm/getDenomContract';

export async function fetchBalanceEvm(tokenId: string, provider: ethers.BrowserProvider, address: string) {
  const erc20 = getDenomContract(provider, tokenId);

  const supplyResult = await erc20.balanceOf(address);

  const amount = supplyResult.toString();
  return {
    amount,
    denom: tokenId,
  };
}
