import { Strategy } from '@hooks/useStrategies';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import { isStrategyOperating, isStrategyScheduled } from './getStrategyStatus';
import { getStrategyTotalExecutions } from './getStrategyTotalExecutions';
import { getEndDateFromRemainingExecutions } from './getEndDateFromRemainingExecutions';
import { getLastExecutionDateFromStrategyEvents } from './getLastExecutionDateFromStrategyEvents';
import { formatDate } from './format/formatDate';

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
