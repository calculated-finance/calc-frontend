import { StrategyTypes } from '@models/StrategyTypes';
import getDenomInfo from '@utils/getDenomInfo';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';
import { getStrategyType } from './getStrategyType';

export function getPriceCeilingFloor(strategy: Vault) {
  if (!strategy.minimum_receive_amount) {
    return undefined;
  }

  const { priceDeconversion } =
    getStrategyType(strategy) === StrategyTypes.DCAIn
      ? getDenomInfo(getStrategyResultingDenom(strategy))
      : getDenomInfo(getStrategyInitialDenom(strategy));

  const price =
    getStrategyType(strategy) === StrategyTypes.DCAIn
      ? parseFloat(strategy.swap_amount) / parseFloat(strategy.minimum_receive_amount)
      : parseFloat(strategy.minimum_receive_amount) / parseFloat(strategy.swap_amount);

  return Number(priceDeconversion(price).toFixed(3));
}
