import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/proto-signing';
import { ethers, formatEther } from 'ethers';
import * as erc20json from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { useCosmWasmClient } from './useCosmWasmClient';
import { useMetamask } from './useMetamask';



export type BalanceResponse = {
  amount: number;
};

export function getDisplayAmount(token: DenomInfo, amount: number) {
  return token.conversion(amount);
}

const useBalanceEVM = (token: DenomInfo) => {
  const { address } = useWallet();
  const { provider} = useMetamask();


  return useQuery<Coin>(
    ['balance-evm', token?.id, address, provider],
    async () => {
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      if (!address) {
        throw new Error('No address provided');
      }
      try {
        
        const erc20 = new ethers.Contract(token.id, erc20json.abi, provider);

        const result = await erc20.totalSupply();

        return {
          amount: formatEther(result),
          denom: token.id,
        }
      } catch (e) {
        console.log('error', e);
      }
    },
    {
      // enabled: !!token && !!address && !!provider,
      keepPreviousData: true,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );
};


const useBalanceCosm = (token: DenomInfo) => {
  const { address } = useWallet();
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
      enabled: !!token && !!address && !!client,
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
};

const useBalance = (token: DenomInfo) => {

  const evmBalance = useBalanceEVM(token);
  return evmBalance;
  // const cosmBalance = useBalanceCosm(token);

  // return walletType === WalletTypes.METAMASK ? evmBalance : cosmBalance;
};

  

export default useBalance;
