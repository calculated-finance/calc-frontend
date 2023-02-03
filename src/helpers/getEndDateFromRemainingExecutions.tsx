import { Strategy } from '@hooks/useStrategies';

export function getEndDateFromRemainingExecutions(strategy: Strategy, startDate: Date, remainingExecutions: number) {
  switch (strategy.time_interval) {
    case 'half_hourly':
      startDate.setHours(startDate.getHours() + remainingExecutions/2);
      break;
    case 'hourly':
      startDate.setHours(startDate.getHours() + remainingExecutions);
      break;
    case 'daily':
      startDate.setDate(startDate.getDate() + remainingExecutions);
      break;
      case 'half_daily':
      startDate.setDate(startDate.getDate() + remainingExecutions/2);
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
