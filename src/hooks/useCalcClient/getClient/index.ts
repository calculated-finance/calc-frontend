import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from '@models/ChainId';
import { getChainContractAddress } from '@helpers/chains';
import { Strategy } from '@models/Strategy';
import { StrategyEvent } from '@hooks/StrategyEvent';
import { Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';
import getCalcClient from './clients/cosmos';

export type CalcClient = {
  fetchAllPairs: () => Promise<Pair[]>;
  fetchVault: (id: string) => Promise<Strategy>;
  fetchVaultEvents: (id: string) => Promise<StrategyEvent[]>;
  fetchVaults: (userAddress: string) => Promise<Strategy[]>;
  fetchAllVaults: () => Promise<Strategy[]>;
};

export default function getClient(
  chainId: ChainId,
  cosmWasmClient: CosmWasmClient | null,
  getDenomById: (denom: string) => DenomInfo | undefined,
) {
  if (!cosmWasmClient) return null;
  return getCalcClient(chainId, getChainContractAddress(chainId), cosmWasmClient, getDenomById);
}
