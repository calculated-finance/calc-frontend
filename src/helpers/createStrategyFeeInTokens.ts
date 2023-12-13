import { DenomInfo } from '@utils/DenomInfo';
import { CREATE_VAULT_FEE } from 'src/constants';

export function createStrategyFeeInTokens(price: number, denom: DenomInfo) {
  return denom.toAtomic(CREATE_VAULT_FEE / price);
}
