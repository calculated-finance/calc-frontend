import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/proto-signing';
import { ethers } from 'ethers';
import * as erc20json from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { useCosmWasmClient } from './useCosmWasmClient';
import { useMetamask } from './useMetamask';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';

export async function fetchBalanceEvm(token: DenomInfo, provider: ethers.BrowserProvider, address: string) {
  const erc20 = new ethers.Contract(token.id, erc20json.abi, provider);

  console.log('token', token.id);

  console.log(token.id, address, provider);
  const supplyResult = await erc20.balanceOf(address);

  const amount = supplyResult.toString();
  return {
    amount,
    denom: token.id,
  };
}

export type BalanceResponse = {
  amount: number;
};

export function getDisplayAmount(token: DenomInfo, amount: number) {
  return token.conversion(amount);
}

function useBalance(token: DenomInfo) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);
  const provider = useMetamask((state) => state.provider);

  const result = useQuery<Coin>(
    ['balance', token?.id, address, client],
    () => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      if (chain === Chains.Moonbeam) {
        if (!provider) {
          throw new Error('Provider not initialized');
        }
        return fetchBalanceEvm(token, provider, address);
      }

      return client.getBalance(address, token.id);
    },
    {
      enabled: !!token && !!address && !!chain,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );

  return {
    displayAmount: result.data ? getDisplayAmount(token, Number(result.data.amount)) : 0,

    ...result,
  };
}

export default useBalance;
