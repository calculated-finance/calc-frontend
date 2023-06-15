import { Chains } from '@hooks/useChain/Chains';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';

export function isStrategyV2(strategy: Strategy | StrategyOsmosis, chain: Chains) {
  if (chain === Chains.Osmosis) {
    return true;
  }
  if ('deposited_amount' in strategy) {
    return true;
  }
  return false;
}
