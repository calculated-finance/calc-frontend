import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from '@hooks/useChain/Chains';
import { getChainContractAddress } from '@helpers/chains';
import getCalcClient from './clients/cosmos';

export type CalcClient = {
  fetchStrategy: (id: string) => Promise<any>;
  fetchStrategyEvents: (id: string) => Promise<any>;
  fetchStrategies: (userAddress: string) => Promise<any>;
  fetchAllStrategies: () => Promise<any[]>;
};

export default function getClient(chain: ChainId, cosmClient: CosmWasmClient | null) {
  if (!cosmClient) return null;
  return getCalcClient(getChainContractAddress(chain), cosmClient, chain);
}
