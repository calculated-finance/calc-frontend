import { Chains } from '@hooks/useChain/Chains';
import { Strategy } from '@models/Strategy';

export function isStrategyV2(strategy: Strategy, chain: Chains) {
  if (chain === Chains.Osmosis) {
    return true;
  }
  if ('deposited_amount' in strategy) {
    return true;
  }
  return false;
}
