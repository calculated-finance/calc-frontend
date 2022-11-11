import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import { findLast } from 'lodash'
import { isStrategyOperating, isStrategyScheduled } from './getStrategyStatus';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';

function getEndDateFromRemainingExecutions(strategy: Strategy, startDate: Date, remainingExecutions: number)
{
  switch (strategy.time_interval) {
    case 'hourly':
      startDate.setHours(startDate.getHours() + remainingExecutions)
      break
    case 'daily':
      startDate.setDate(startDate.getDate() + remainingExecutions)
      break
    case 'weekly':
      startDate.setDate(startDate.getDate() + 7 * remainingExecutions)
      break
    case 'monthly':
      startDate.setMonth(startDate.getMonth() + remainingExecutions)
      break
    default:
      return '-'
  }

  return startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getLastExecutionDateFromStrategyEvents(events: Event[]) {
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (strategy.trigger.fin_limit_order)
  {
    return 'pending strategy start'
  }

  const executions = getStrategyTotalExecutions(strategy)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (isStrategyScheduled(strategy) && strategy?.trigger?.time)
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const startDate = new Date(strategy.trigger.time.target_time / 1000000)
    return getEndDateFromRemainingExecutions(strategy, startDate, executions)
  }

  if (!events)
  {
    return '-'
  }

  const lastExecutionDate = getLastExecutionDateFromStrategyEvents(events)
  
  if (isStrategyOperating(strategy) && lastExecutionDate)
  {

    return getEndDateFromRemainingExecutions(strategy, lastExecutionDate, executions)
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