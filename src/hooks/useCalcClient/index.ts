import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import { BrowserProvider } from 'ethers';
import { fetchStrategyEVM } from './fetchStrategy';
import { fetchStrategyCosmos } from './fetchStrategyCosmos';

function getClient(chain: Chains, cosmClient: CosmWasmClient | null, evmProvider: BrowserProvider | null) {
  if (chain === Chains.Moonbeam) {
    if (!evmProvider) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyEVM(id, evmProvider),
    };
  }

  if (chain === Chains.Kujira) {
    if (!cosmClient) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyCosmos(cosmClient, chain, id),
    };
  }

  if (chain === Chains.Osmosis) {
    if (!cosmClient) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyCosmos(cosmClient, chain, id),
    };
  }

  throw new Error('Unsupported chain');
}

export function useCalcClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const cosmClient = useCosmWasmClient((state) => state.client);

  if (!chain) return null;

  return getClient(chain, cosmClient, evmProvider);
}
