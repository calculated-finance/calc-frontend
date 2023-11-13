import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import getClient from './getClient';
import { useEffect, useState } from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@hooks/useChain';
import { useQuery } from '@tanstack/react-query';

export function useCalcClient() {
  const evmProvider = useMetamask((state) => state.provider);
  const { getCosmWasmClient } = useCosmWasmClient();
  const chain = useChain();

  // const [client, setCosmClient] = useState<CosmWasmClient | null>(null);

  const query = useQuery<CosmWasmClient | null>(
    ['cosmWasmClient', chain],
    async () => {
      if (!getCosmWasmClient) return null;

      return await getCosmWasmClient();
    },
    {
      enabled: !!getCosmWasmClient,
      retry: false,
    },
  );

  if (!chain || !chain.chainConfig) return null;

  if (!query.data) {
    return null;
  }

  // useEffect(() => {
  //   if (!getCosmWasmClient) return;

  //   getCosmWasmClient().then(setCosmClient);
  // }, [getCosmWasmClient]);

  return getClient(chain.chainConfig.name, query.data, evmProvider);
}
