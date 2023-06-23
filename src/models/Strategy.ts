import { DenomInfo } from '@utils/DenomInfo';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';

export type Strategy = {
  id: string;
  rawData: Vault;
};

// export type Strategy = {
//   rawData: Vault;
//   resultingDenom: DenomInfo;
//   initialDenom: DenomInfo;
//   balance: number;
// };
