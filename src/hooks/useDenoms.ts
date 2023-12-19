import { ChainId } from './useChainId/Chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { KeyValuePair, all, flatten, isNil, map, reduce, values, zip } from 'rambda';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { ChainClient, useChainClient } from './useChainClient';
import { useChainId } from './useChainId';

const useDenoms = () => {
  const { chainId } = useChainId();
  const chainIds = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS;
  const chainClients = map((chainId) => useChainClient(chainId), chainIds);

  const { data: denoms, ...helpers } = useQuery<{ [x: string]: { [x: string]: DenomInfo } }>(
    ['denoms'],
    async () =>
      reduce(
        (acc: {}, [chainId, denoms]: KeyValuePair<ChainId, { [x: string]: DenomInfo }>) => ({
          ...acc,
          [chainId]: denoms,
        }),
        {},
        zip(
          chainIds,
          await Promise.all(map((client: ChainClient | undefined) => client?.fetchDenoms() ?? {}, chainClients)),
        ),
      ),
    {
      enabled: all((c) => !isNil(c), chainClients),
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const allDenoms: DenomInfo[] = denoms ? flatten(map(values, values(denoms))) : [];

  return {
    allDenoms,
    denoms,
    getDenomInfo: (id: string, injectedChainId?: ChainId): DenomInfo | undefined =>
      denoms?.[injectedChainId ?? chainId]?.[id],
    ...helpers,
  };
};

export default useDenoms;
