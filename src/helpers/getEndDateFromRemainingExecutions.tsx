import { StrategyOsmosis } from '@hooks/useStrategies';
import { Strategy } from '@models/Strategy';
import { ExecutionIntervals } from '@models/ExecutionIntervals';

export function getEndDateFromRemainingExecutions(
  strategy: Strategy | StrategyOsmosis,
  startDate: Date,
  remainingExecutions: number,
): Date | undefined {
  if (typeof strategy.time_interval === 'object') {
    const customIncrements = strategy.time_interval.custom.seconds;
    startDate.setSeconds(startDate.getSeconds() + customIncrements * remainingExecutions);

    return startDate;
  }

  switch (strategy.time_interval as ExecutionIntervals) {
    case 'minute':
      startDate.setMinutes(startDate.getMinutes() * remainingExecutions);
      break;
    case 'half_hourly':
      startDate.setMinutes(startDate.getMinutes() + 30 * remainingExecutions);
      break;
    case 'hourly':
      startDate.setHours(startDate.getHours() + remainingExecutions);
      break;
    case 'daily':
      startDate.setDate(startDate.getDate() + remainingExecutions);
      break;
    case 'half_daily':
      startDate.setHours(startDate.getHours() + 12 * remainingExecutions);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() + 7 * remainingExecutions);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() + remainingExecutions);
      break;
    default:
      return undefined;
  }

  return startDate;
}
