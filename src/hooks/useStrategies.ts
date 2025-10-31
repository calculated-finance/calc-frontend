import { ChainContext } from '@cosmos-kit/core';
import { useChains } from '@cosmos-kit/react';
import { getAddressPrefix, getChainCosmosName, getDCAContractAddress } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { Strategy } from '@models/Strategy';
import { useQuery } from '@tanstack/react-query';
import { bech32 } from 'bech32';
import { map, values } from 'rambda';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { queryClient } from 'src/pages/queryClient';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import useDenoms from './useDenoms';
import { useWallet } from './useWallet';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export function useStrategies() {
  const { address, connected } = useWallet();
  const { getDenomById } = useDenoms();
  const chains = values(
    useChains((process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map(getChainCosmosName)),
  );

  const { data: strategies, isLoading } = useQuery<Strategy[]>(
    ['strategies', address],
    async () => {
      const fetchStrategies = async (chain: ChainContext) => {
        const client = await chain.getCosmWasmClient();
        const calcClient = getCalcClient(
          chain.chain.chain_id as ChainId,
          getDCAContractAddress(chain.chain.chain_id as ChainId),
          client as any,
          getDenomById,
        );
        const userAddress = bech32.encode(
          getAddressPrefix(chain.chain.chain_id as ChainId),
          bech32.decode(address!).words,
        );
        return calcClient.fetchVaults(userAddress);
      };

      return map(
        (result: PromiseSettledResult<Strategy[]>) => (result.status === 'fulfilled' ? result.value : []),
        await Promise.allSettled(chains.map(fetchStrategies)),
      ).flat();
    },
    {
      enabled: connected && !!address,
    },
  );

  return {
    data: strategies,
    isLoading,
  };
}
