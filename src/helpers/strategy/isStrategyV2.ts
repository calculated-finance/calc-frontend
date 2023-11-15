import { ChainId } from '@hooks/useChain/Chains';
import { Strategy } from '@models/Strategy';

export function isStrategyV2(strategy: Strategy, chain: ChainId) {
  if (['osmosis-1', 'osmo-test-5'].includes(chain)) {
    return true;
  }
  if ('deposited_amount' in strategy) {
    return true;
  }
  return false;
}
