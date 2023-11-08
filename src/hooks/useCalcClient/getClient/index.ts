import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from '@hooks/useChain/Chains';
import { BrowserProvider } from 'ethers';
import { getChainContractAddress } from '@helpers/chains';
import getCosmosClient from './clients/cosmos';
import getEVMClient from './clients/evm';

export default function getClient(
  chain: Chains,
  cosmClient: CosmWasmClient | null,
  evmProvider: BrowserProvider | null,
) {
  if (chain === Chains.Moonbeam) {
    if (!evmProvider) return null;

    return getEVMClient(evmProvider);
  }

  if (!cosmClient) return null;

  return getCosmosClient(getChainContractAddress(chain), cosmClient);
}
