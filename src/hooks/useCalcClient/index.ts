import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import { useEffect, useState } from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import getClient from './getClient';

export function useCalcClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const { getCosmWasmClient } = useCosmWasmClient();

  const [cosmClient, setCosmClient] = useState<CosmWasmClient | null>(null);

  useEffect(() => {
    if (!getCosmWasmClient) return;

    getCosmWasmClient().then(setCosmClient);
  }, [getCosmWasmClient]);

  if (!chain) return null;

  return getClient(chain, cosmClient, evmProvider);
}
