import { Chains } from '@hooks/useChain/Chains';
import { StrategyOsmosis } from '@hooks/useStrategies';
import { Strategy } from '@models/Strategy';

export function isStrategyV2(strategy: Strategy | StrategyOsmosis, chain: Chains) {
  if (chain === Chains.Osmosis) {
    return true;
  }
  if ('deposited_amount' in strategy) {
    return true;
  }
  return false;
}
