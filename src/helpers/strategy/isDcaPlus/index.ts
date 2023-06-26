import { Strategy } from '@models/Strategy';
import { isNil } from 'lodash';

export function getDcaPlusConfig(strategy: Strategy) {
  if (isNil(strategy.rawData.performance_assessment_strategy) || isNil(strategy.rawData.swap_adjustment_strategy)) {
    return null;
  }

  const { swap_adjustment_strategy, performance_assessment_strategy, deposited_amount, escrow_level, escrowed_amount } =
    strategy.rawData;

  if ('risk_weighted_average' in swap_adjustment_strategy) {
    return {
      total_deposit: deposited_amount,
      standard_dca_received_amount: performance_assessment_strategy?.compare_to_standard_dca.received_amount,
      standard_dca_swapped_amount: performance_assessment_strategy?.compare_to_standard_dca.swapped_amount,
      escrow_level,
      escrowed_balance: escrowed_amount,
      model_id: swap_adjustment_strategy?.risk_weighted_average.model_id,
    };
  }
  return null;
}

export function isDcaPlus(strategy: Strategy) {
  return Boolean(getDcaPlusConfig(strategy));
}
