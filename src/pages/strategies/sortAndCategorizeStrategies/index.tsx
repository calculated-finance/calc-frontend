import { isStrategyActive, isStrategyCancelled, isStrategyCompleted, isStrategyScheduled } from '@helpers/strategy';
import { Strategy } from '@models/Strategy';

export function sortAndCategorizeStrategies(strategies: Strategy[] | undefined) {
  const scheduledStrategies = strategies?.filter(isStrategyScheduled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const activeStrategies = strategies?.filter(isStrategyActive).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];
  const completedStrategies = strategies?.filter(isStrategyCompleted).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const cancelledStrategies = strategies?.filter(isStrategyCancelled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  return {
    active: activeStrategies,
    scheduled: scheduledStrategies,
    completed: completedStrategies,
    cancelled: cancelledStrategies,
  };
}
