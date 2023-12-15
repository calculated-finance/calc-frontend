import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from '@hooks/useChainId/Chains';
import { getChainContractAddress } from '@helpers/chains';
import getCalcClient from './clients/cosmos';

export type CalcClient = {
  fetchAllPairs: () => Promise<any[]>;
  fetchVault: (id: string) => Promise<any>;
  fetchVaultEvents: (id: string) => Promise<any>;
  fetchVaults: (userAddress: string) => Promise<any>;
  fetchAllVaults: () => Promise<any[]>;
};

export default function getClient(chainId: ChainId, cosmWasmClient: CosmWasmClient | null) {
  if (!cosmWasmClient) return null;
  return getCalcClient(getChainContractAddress(chainId), cosmWasmClient);
}
