import { WalletTypes, useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/proto-signing';
import { ethers, formatEther } from 'ethers';
import * as erc20json from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { useCosmWasmClient } from './useCosmWasmClient';
import { useMetamask } from './useMetamask';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';

export async function fetchBalanceEvm(token: DenomInfo, provider: ethers.BrowserProvider, address: string) {
  const erc20 = new ethers.Contract(token.id, erc20json.abi, provider);

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

const useBalanceEVM = (token: DenomInfo) => {
  const provider = useMetamask(state => state.provider);
  const { chain } = useChain();
  const { address } = useWallet();

  const result = useQuery<Coin>(
    ['balance-evm', token?.id, provider],
    async () => {
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
        
      return fetchBalanceEvm(token, provider, address);
    },
    {
      enabled: !!token  && !!provider && chain === Chains.Moonbeam && !!address,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );

  return {
    displayAmount: result.data ? Number(result.data.amount) : 0,
    ...result,
  };
};


const useBalanceCosm = (token: DenomInfo) => {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  const result = useQuery<Coin>(
    ['balance', token?.id, address, client],
    () => {

      if (!client) {
        throw new Error('Client not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      return client.getBalance(address, token.id);
    },
    {
      enabled: !!token && !!address && !!client && !!chain && chain !== Chains.Moonbeam,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance cosmos',
      },
    },
  );

  return {
    displayAmount: result.data ? getDisplayAmount(token, Number(result.data.amount)) : 0,

    ...result,
  };
};

const useBalance = (token: DenomInfo) => {

  const { walletType } = useWallet();

  const evmBalance = useBalanceEVM(token);
  const cosmBalance = useBalanceCosm(token);

  return walletType === WalletTypes.METAMASK ? evmBalance : cosmBalance;
};

export default useBalance;


