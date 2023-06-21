import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useMetamask } from '@hooks/useMetamask';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useWallet } from '@hooks/useWallet';
import { Strategy } from '@models/Strategy';
import { fetchStrategyEVM } from './fetchStrategy';
import { executeTopUpCosmos } from './executeTopUpCosmos';
import { executeTopUpEVM } from './executeTopUpEVM';
import { fetchStrategyCosmos } from './fetchStrategyCosmos';

function getClient(
  chain: Chains,
  cosmClient: CosmWasmClient | null,
  evmProvider: BrowserProvider | null,
  evmSigner: JsonRpcSigner | null,
  cosmSigner: SigningCosmWasmClient | null | undefined,
) {
  if (chain === Chains.Moonbeam) {
    if (!evmProvider) return null;
    if (!evmSigner) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyEVM(id, evmProvider),
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpEVM(evmProvider, evmSigner, strategy.id, topUpAmount),
    };
  }

  if (chain === Chains.Kujira) {
    if (!cosmClient) return null;
    if (!cosmSigner) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyCosmos(cosmClient, chain, id),
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpCosmos(address, cosmSigner, chain, strategy, topUpAmount),
    };
  }

  if (chain === Chains.Osmosis) {
    if (!cosmClient) return null;
    if (!cosmSigner) return null;

    return {
      fetchStrategy: (id: string) => fetchStrategyCosmos(cosmClient, chain, id),
      topUpStrategy: (address: string, strategy: Strategy, topUpAmount: number) =>
        executeTopUpCosmos(address, cosmSigner, chain, strategy, topUpAmount),
    };
  }

  throw new Error('Unsupported chain');
}

export function useCalcClient(chain: Chains) {
  const evmProvider = useMetamask((state) => state.provider);
  const evmSigner = useMetamask((state) => state.signer);
  const { signingClient: cosmSigner } = useWallet();
  const cosmClient = useCosmWasmClient((state) => state.client);

  if (!chain) return null;

  return getClient(chain, cosmClient, evmProvider, evmSigner, cosmSigner);
}
