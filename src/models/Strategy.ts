import { DenomInfo } from '@utils/DenomInfo';
import { Vault } from 'src/interfaces/dca/response/get_vault';

export enum StrategyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SCHEDULED = 'scheduled',
}

export type Strategy = {
  id: string;
  owner: string;
  status: StrategyStatus;
  resultingDenom: DenomInfo;
  initialDenom: DenomInfo;
  rawData: Omit<Vault, 'id' | 'owner' | 'status'>;
};
