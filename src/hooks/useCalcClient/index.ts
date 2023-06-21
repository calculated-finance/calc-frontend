import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import getClient from './getClient';

export function useCalcClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const cosmClient = useCosmWasmClient((state) => state.client);

  if (!chain) return null;

  return getClient(chain, cosmClient, evmProvider);
}
