import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { InitialDenomInfo } from '@utils/DenomInfo';
import { Coin } from '@cosmjs/proto-signing';
import { fromAtomic } from '@utils/getDenomInfo';
import { useChainId } from '@hooks/useChainId';
import { useChainClient } from '@hooks/useChainClient';

export type BalanceResponse = {
  amount: number;
};

function useBalance(denom: InitialDenomInfo) {
  const { address } = useWallet();
  const { chainId } = useChainId();
  const client = useChainClient(chainId);

  const result = useQuery<Coin>(
    ['balance', chainId, address, denom.id],
    () => client!.fetchTokenBalance(address!, denom),
    {
      enabled: !!denom.id && !!address && !!chainId && !!client,
      meta: {
        errorMessage: 'Error fetching balance',
      },
    },
  );

  return {
    displayAmount: result.data ? fromAtomic(denom, Number(result.data.amount)) : 0,
    ...result,
  };
}

export default useBalance;
