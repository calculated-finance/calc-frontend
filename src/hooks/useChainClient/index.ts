import { ChainId } from '@models/ChainId';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { ARCHWAY_CHAINS, KUJIRA_CHAINS, NEUTRON_CHAINS, OSMOSIS_CHAINS } from 'src/constants';
import { kujiraChainClient } from './kujira';
import { osmosisChainClient } from './osmosis';
import { archwayChainClient } from './archway';
import { neutronChainClient } from './neutron';
import { ChainClient } from './helpers';

export function useChainClient(chainId: ChainId) {
  const { cosmWasmClient } = useCosmWasmClient(chainId);

  const { data: chainClient } = useQuery<ChainClient>(
    ['chainClient', chainId],
    async () => {
      if (KUJIRA_CHAINS.includes(chainId)) {
        return kujiraChainClient(chainId, cosmWasmClient!);
      }

      if (OSMOSIS_CHAINS.includes(chainId)) {
        return osmosisChainClient(chainId, cosmWasmClient!);
      }

      if (ARCHWAY_CHAINS.includes(chainId)) {
        return archwayChainClient(chainId, cosmWasmClient!);
      }

      if (NEUTRON_CHAINS.includes(chainId)) {
        return neutronChainClient(chainId, cosmWasmClient!);
      }

      throw new Error(`Unsupported chain ${chainId}`);
    },
    {
      enabled: !!chainId && !!cosmWasmClient,
      staleTime: 1000 * 60 * 10,
      meta: {
        errorMessage: 'Error fetching chain client',
      },
    },
  );

  return chainClient;
}
