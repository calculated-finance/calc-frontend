import getDenomInfo from '@utils/getDenomInfo';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import { getStrategyInitialDenom } from './getStrategyInitialDenom';
import { getStrategyResultingDenom } from './getStrategyResultingDenom';
import { isBuyStrategy } from './isBuyStrategy';

export function getPriceCeilingFloor(strategy: Vault) {
  if (!strategy.minimum_receive_amount) {
    return undefined;
  }

  const { priceDeconversion } = isBuyStrategy(strategy)
    ? getDenomInfo(getStrategyResultingDenom(strategy))
    : getDenomInfo(getStrategyInitialDenom(strategy));

  const price = isBuyStrategy(strategy)
    ? parseFloat(strategy.swap_amount) / parseFloat(strategy.minimum_receive_amount)
    : parseFloat(strategy.minimum_receive_amount) / parseFloat(strategy.swap_amount);

  return Number(priceDeconversion(price).toFixed(3));
}
