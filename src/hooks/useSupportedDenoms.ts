import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';
import { V3Pair } from '@models/Pair';
import { useChain } from '@cosmos-kit/react';
import { getChainContractAddress } from '@helpers/chains';
import { ChainContext } from '@cosmos-kit/core';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'src/pages/queryClient';
import { allDenomsFromPairs } from './usePairs';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChain/Chains';

export function useSupportedDenoms() {
  const kujiraChainContext = useChain('kujira');
  const osmosisChainContext = useChain('osmosis');

  const fetchPairs = async (chainContext: ChainContext) => {
    const client = await chainContext.getCosmWasmClient();
    const calcClient = getCalcClient(
      getChainContractAddress(chainContext.chain.chain_id as ChainId),
      client,
      chainContext.chain.chain_id as ChainId,
    );
    const pairs = await calcClient.fetchAllPairs();
    queryClient.setQueryData(['pairs', chainContext.chain.chain_id], pairs);
    return pairs;
  };

  const { data: allPairs } = useQuery<V3Pair[]>(
    ['all-pairs'],
    async () => (await Promise.all([kujiraChainContext, osmosisChainContext].map(fetchPairs))).flat(),
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: !!kujiraChainContext && !!osmosisChainContext,
      meta: {
        errorMessage: 'Error fetching pairs',
      },
    },
  );

  const allDenoms = allDenomsFromPairs(allPairs);

  const allDenomInfos = useMemo(() => allDenoms.map((denom) => getDenomInfo(denom)), [allDenoms]);

  return allDenomInfos;
}
