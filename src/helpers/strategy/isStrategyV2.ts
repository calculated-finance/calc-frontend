import { useChainStore, Chains } from '@hooks/useChain';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';

export function isStrategyV2(strategy: Strategy | StrategyOsmosis) {
  const { chain } = useChainStore.getState();
  if (chain === Chains.Osmosis) {
    return true;
  }
  if ('deposited_amount' in strategy) {
    return true;
  }
  return false;
}
