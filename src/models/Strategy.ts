import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

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
  rawData: Omit<Vault, 'id' | 'owner' | 'status'>;
};

// export type Strategy = {
//   rawData: Vault;
//   resultingDenom: DenomInfo;
//   initialDenom: DenomInfo;
//   balance: number;
// };
