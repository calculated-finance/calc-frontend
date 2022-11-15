import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import { findLast } from 'lodash';
import { isStrategyOperating, isStrategyScheduled } from './getStrategyStatus';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';

function getEndDateFromRemainingExecutions(strategy: Strategy, startDate: Date, remainingExecutions: number) {
  switch (strategy.time_interval) {
    case 'hourly':
      startDate.setHours(startDate.getHours() + remainingExecutions);
      break;
    case 'daily':
      startDate.setDate(startDate.getDate() + remainingExecutions);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() + 7 * remainingExecutions);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() + remainingExecutions);
      break;
    default:
      return '-';
  }

  return startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getLastExecutionDateFromStrategyEvents(events: Event[]) {
  const lastExecutionEvent = findLast(events, (event: Event) => {
    const { data } = event;
    if ('dca_vault_execution_triggered' in data) {
      return data.dca_vault_execution_triggered;
    }
    return false;
  }) as Event;

  // vault has no executions yet
  if (!lastExecutionEvent) {
    return undefined;
  }

  return new Date(Number(lastExecutionEvent.timestamp) / 1000000);
}

export function getStrategyEndDate(strategy: Strategy, events: Event[] | undefined) {
  const { trigger } = strategy;
  if (trigger && 'fin_limit_order' in trigger) {
    return 'Pending strategy start';
  }

  const executions = getStrategyTotalExecutions(strategy);

  if (isStrategyScheduled(strategy) && trigger && 'time' in trigger) {
    const startDate = new Date(Number(trigger.time.target_time) / 1000000);
    return getEndDateFromRemainingExecutions(strategy, startDate, executions);
  }

  if (!events) {
    return '-';
  }

  const lastExecutionDate = getLastExecutionDateFromStrategyEvents(events);

  if (isStrategyOperating(strategy) && lastExecutionDate) {
    return getEndDateFromRemainingExecutions(strategy, lastExecutionDate, executions);
  }

  if (lastExecutionDate) {
    return lastExecutionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return '-';
}
