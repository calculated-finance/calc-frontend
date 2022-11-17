import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import { findLast } from 'lodash';
import { isStrategyOperating, isStrategyScheduled } from './getStrategyStatus';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';
import { getEndDateFromRemainingExecutions } from './getEndDateFromRemainingExecutions';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '-';
  }
  return date.toLocaleDateString('en-US', {
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
    return formatDate(getEndDateFromRemainingExecutions(strategy, startDate, executions));
  }

  if (!events) {
    return '-';
  }

  const lastExecutionDate = getLastExecutionDateFromStrategyEvents(events);

  if (isStrategyOperating(strategy) && lastExecutionDate) {
    return formatDate(getEndDateFromRemainingExecutions(strategy, lastExecutionDate, executions));
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
