import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { KeyValuePair, all, indexBy, isNil, map, mergeAll, reduce, toLower, values, zip } from 'rambda';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { ChainId } from '@models/ChainId';
import { ChainClient, useChainClient } from '@hooks/useChainClient';
import { useChainId } from '@hooks/useChainId';

const useDenoms = () => {
  const chainIds = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS;
  const chainClients = chainIds.map(useChainClient);

  const { data: denoms, ...helpers } = useQuery<{ [x: string]: { [x: string]: DenomInfo } }>(
    ['denoms', chainIds],
    async () =>
      reduce(
        (
          acc: { [chainId: string]: { [id: string]: DenomInfo } },
          [chainId, denomsById]: KeyValuePair<ChainId, { [id: string]: DenomInfo }>,
        ) => ({ ...acc, [chainId]: denomsById }),
        {} as { [chainId: string]: { [id: string]: DenomInfo } },
        zip(chainIds, await Promise.all(map((client: ChainClient | undefined) => client!.fetchDenoms(), chainClients))),
      ),
    {
      enabled: all((c) => !isNil(c), chainClients),
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const { chainId } = useChainId();
  const allDenoms = (denoms ? denoms && mergeAll(values(denoms)) : {}) as { [x: string]: DenomInfo };

  return {
    denoms,
    allDenoms,
    getDenomById: (id: string): DenomInfo | undefined => allDenoms[id],
    getDenomByName: (name: string, injectedChainId?: ChainId): DenomInfo | undefined =>
      indexBy(
        (d) => toLower(d.name),
        values(denoms?.[injectedChainId ?? chainId] ?? ({} as { [id: string]: DenomInfo })),
      )?.[toLower(name)] as DenomInfo,
    ...helpers,
  };
};

export default useDenoms;
