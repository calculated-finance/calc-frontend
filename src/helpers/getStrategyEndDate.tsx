import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import { findLast } from 'lodash'
import { isStrategyOperating } from './getStrategyStatus';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';

function getLastExecutionDate(events: Event[]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const lastExecutionEvent = findLast(events, (event: Event) => event.data.dca_vault_execution_completed) as Event

  // vault has no executions yet
  if (!lastExecutionEvent)
  {
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Date(lastExecutionEvent.timestamp / 1000000)
}

export function getStrategyEndDate(strategy: Strategy, events: Event[] | undefined) {
  if (!events)
  {
    return '-'
  }

  const lastExecutionDate = getLastExecutionDate(events)

  if (isStrategyOperating(strategy) && lastExecutionDate)
  {
    const executions = getStrategyTotalExecutions(strategy)

    switch (strategy.time_interval) {
      case 'hourly':
        lastExecutionDate.setHours(lastExecutionDate.getHours() + executions)
        break
      case 'daily':
        lastExecutionDate.setDate(lastExecutionDate.getDate() + executions)
        break
      case 'weekly':
        lastExecutionDate.setDate(lastExecutionDate.getDate() + 7 * executions)
        break
      case 'monthly':
        lastExecutionDate.setMonth(lastExecutionDate.getMonth() + executions)
        break
      default:
        return '-'
    }

    return lastExecutionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (lastExecutionDate)
  {
    return lastExecutionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return '-'
}