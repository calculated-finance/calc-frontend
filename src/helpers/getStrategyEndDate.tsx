import { Strategy } from '@hooks/useStrategies';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';

export function getStrategyEndDate(strategy: Strategy) {
  const executions = getStrategyTotalExecutions(strategy)

  const now = new Date()

  switch (strategy.time_interval) {
    case 'hourly':
      now.setHours(now.getHours() + executions)
      break
    case 'daily':
      now.setDate(now.getDate() + executions)
      break
    case 'weekly':
      now.setDate(now.getDate() + 7 * executions)
      break
    case 'monthly':
      now.setMonth(now.getMonth() + executions)
      break
    default:
      return '-'
  }

  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}