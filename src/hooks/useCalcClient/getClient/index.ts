import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from '@hooks/useChainId/Chains';
import { getChainContractAddress } from '@helpers/chains';
import getCalcClient from './clients/cosmos';
import { Strategy } from '@models/Strategy';
import { StrategyEvent } from '@hooks/StrategyEvent';
import { Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';

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
  getDenomInfo: (denom: string) => DenomInfo | undefined,
) {
  if (!cosmWasmClient) return null;
  return getCalcClient(getChainContractAddress(chainId), cosmWasmClient, getDenomInfo);
}
