import { InitialDenomInfo } from '@utils/DenomInfo';
import { toAtomic } from '@utils/getDenomInfo';
import { CREATE_VAULT_FEE } from 'src/constants';

export function createStrategyFeeInTokens(price: number, denom: InitialDenomInfo) {
  return toAtomic(denom, CREATE_VAULT_FEE / price);
}
