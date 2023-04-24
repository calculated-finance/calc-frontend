import { useChainStore, Chains } from '@hooks/useChain';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { isNil } from 'lodash';

export function getDcaPlusConfig(strategy: Strategy | StrategyOsmosis) {
  const { chain } = useChainStore.getState();
  if (chain === Chains.Osmosis) {
    const osmosisStrategy = strategy as StrategyOsmosis;

    if (isNil(osmosisStrategy.performance_assessment_strategy) || isNil(osmosisStrategy.swap_adjustment_strategy)) {
      return null;
    }
    return {
      total_deposit: osmosisStrategy.deposited_amount,
      standard_dca_received_amount:
        osmosisStrategy.performance_assessment_strategy?.compare_to_standard_dca.received_amount,
      standard_dca_swapped_amount:
        osmosisStrategy.performance_assessment_strategy?.compare_to_standard_dca.swapped_amount,
      escrow_level: osmosisStrategy.escrow_level,
      escrowed_balance: osmosisStrategy.escrowed_amount,
      model_id: osmosisStrategy.swap_adjustment_strategy?.dca_plus.model_id,
    };
  }

  return (strategy as Strategy).dca_plus_config;
}

export function isDcaPlus(strategy: Strategy) {
  return Boolean(getDcaPlusConfig(strategy));
}
