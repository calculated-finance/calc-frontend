import { useQuery } from '@tanstack/react-query';
import { DenomInfo, fromPartial } from '@utils/DenomInfo';
import { KeyValuePair, all, indexBy, isNil, map, mergeAll, reduce, toLower, values, zip } from 'rambda';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { ChainClient, useChainClient } from './useChainClient';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';

const useDenoms = () => {
  const chainIds = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS;
  const chainClients = chainIds.map(useChainClient);

  const { data: denoms, ...helpers } = useQuery<{ [x: string]: { [x: string]: DenomInfo } }>(
    ['denoms', chainIds],
    async () =>
      reduce(
        (
          acc: { [x: string]: { [x: string]: DenomInfo } },
          [c, d]: KeyValuePair<ChainId, { [x: string]: DenomInfo }>,
        ) => ({ ...acc, [c]: d }),
        {} as { [x: string]: { [x: string]: DenomInfo } },
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

  const { chainId } = useChainId();

  return {
    denoms,
    allDenoms: denoms ? denoms && mergeAll(values(denoms)) : {},
    getDenomById: (id: string, injectedChainId?: ChainId): DenomInfo | undefined =>
      denoms?.[injectedChainId ?? chainId]?.[id],
    getDenomByName: (name: string, injectedChainId?: ChainId): DenomInfo | undefined =>
      indexBy(
        (d) => toLower(d.name),
        values(denoms?.[injectedChainId ?? chainId] ?? ({} as { [x: string]: DenomInfo })),
      )?.[toLower(name)] as DenomInfo,
    ...helpers,
  };
};

export default useDenoms;
