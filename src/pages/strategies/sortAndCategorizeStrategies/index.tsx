import { isStrategyActive, isStrategyCancelled, isStrategyCompleted, isStrategyScheduled } from '@helpers/strategy';
import { Strategy } from '@models/Strategy';

export function sortAndCategorizeStrategies(strategies: Strategy[] | undefined) {
  const scheduledStrategies =
    strategies
      ?.filter(isStrategyScheduled)
      .sort((a, b) => Number(b.rawData.created_at) - Number(a.rawData.created_at)) ?? [];

  const activeStrategies =
    strategies?.filter(isStrategyActive).sort((a, b) => Number(b.rawData.created_at) - Number(a.rawData.created_at)) ??
    [];
  const completedStrategies =
    strategies
      ?.filter(isStrategyCompleted)
      .sort((a, b) => Number(b.rawData.created_at) - Number(a.rawData.created_at)) ?? [];

  const cancelledStrategies =
    strategies
      ?.filter(isStrategyCancelled)
      .sort((a, b) => Number(b.rawData.created_at) - Number(a.rawData.created_at)) ?? [];

  return {
    active: activeStrategies,
    scheduled: scheduledStrategies,
    completed: completedStrategies,
    cancelled: cancelledStrategies,
  };
}
