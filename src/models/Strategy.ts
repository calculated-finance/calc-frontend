import { InitialDenomInfo, ResultingDenomInfo } from '@utils/DenomInfo';
import { Vault } from 'src/interfaces/dca/response/get_vault';
import { ChainId } from './ChainId';

export enum StrategyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SCHEDULED = 'scheduled',
}

export type Strategy = {
  chainId: ChainId;
  id: string;
  owner: string;
  status: StrategyStatus;
  resultingDenom: ResultingDenomInfo;
  initialDenom: InitialDenomInfo;
  rawData: Omit<Vault, 'id' | 'owner' | 'status'>;
};
