import { CREATE_VAULT_FEE, ONE_MILLION } from 'src/constants';

export function createStrategyFeeInTokens(price: number | undefined) {
  return price ? ((CREATE_VAULT_FEE / price) * ONE_MILLION).toFixed(0) : '0';
}
