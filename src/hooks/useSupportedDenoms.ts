import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';
import { V3Pair } from '@models/Pair';
import { useChains } from '@cosmos-kit/react';
import { getChainContractAddress, getChainInfo } from '@helpers/chains';
import { ChainContext } from '@cosmos-kit/core';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'src/pages/queryClient';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { values } from 'rambda';
import { allDenomsFromPairs } from './usePairs';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChainId/Chains';

export function useSupportedDenoms() {
  const allChainContexts = values(
    useChains(
      (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map(
        (chainId) => getChainInfo(chainId).chainName,
      ),
    ),
  );

  const fetchPairs = async (chainContext: ChainContext) => {
    const client = await chainContext.getCosmWasmClient();
    const calcClient = getCalcClient(getChainContractAddress(chainContext.chain.chain_id as ChainId), client);
    const pairs = await calcClient.fetchAllPairs();
    queryClient.setQueryData(['pairs', chainContext.chain.chain_id], pairs);
    return pairs;
  };

  const { data: allPairs } = useQuery<V3Pair[]>(
    ['all-pairs', process.env.NEXT_PUBLIC_APP_ENV],
    async () => (await Promise.all(allChainContexts.map(fetchPairs))).flat(),
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: !!allChainContexts,
      meta: {
        errorMessage: 'Error fetching pairs',
      },
    },
  );

  const allDenoms = allDenomsFromPairs(allPairs);

  return useMemo(() => allDenoms.map((denom) => getDenomInfo(denom)), [allDenoms.length]);
}
