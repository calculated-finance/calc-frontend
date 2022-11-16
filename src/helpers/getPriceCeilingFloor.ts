import { StrategyTypes } from '@models/StrategyTypes';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import { getStrategyType } from './getStrategyType';

export function getPriceCeilingFloor(strategy: Vault) {
  if (!strategy.minimum_receive_amount) {
    return undefined;
  }

  const price =
    getStrategyType(strategy) === StrategyTypes.DCAIn
      ? parseFloat(strategy.swap_amount) / parseFloat(strategy.minimum_receive_amount)
      : parseFloat(strategy.minimum_receive_amount) / parseFloat(strategy.swap_amount);

  return price.toFixed(3);
}
