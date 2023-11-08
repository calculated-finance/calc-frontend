import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import getClient from './getClient';
import { useEffect, useState } from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

export function useCalcClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const { getCosmWasmClient } = useCosmWasmClient();

  if (!getCosmWasmClient) {
    throw new Error('getCosmWasmClient undefined');
  }

  const [client, setCosmClient] = useState<CosmWasmClient | null>(null);

  useEffect(() => {
    if (!getCosmWasmClient) return;

    getCosmWasmClient().then(setCosmClient);
  }, [getCosmWasmClient]);

  if (!chain) return null;

  return getClient(chain, client, evmProvider);
}
