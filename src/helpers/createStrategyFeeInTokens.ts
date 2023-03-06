import { CREATE_VAULT_FEE, ONE_MILLION } from 'src/constants';

export function createStrategyFeeInTokens(price: number) {
  return ((CREATE_VAULT_FEE / price) * ONE_MILLION).toFixed(0);
}
