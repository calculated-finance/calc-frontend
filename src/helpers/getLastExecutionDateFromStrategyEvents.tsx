import { findLast } from 'lodash';
import { StrategyEvent } from '@hooks/useStrategyEvents';

export function getLastExecutionDateFromStrategyEvents(events: StrategyEvent[]) {
  const lastExecutionEvent = findLast(events, (event: StrategyEvent) => {
    const { data } = event;
    if ('dca_vault_execution_triggered' in data) {
      return data.dca_vault_execution_triggered;
    }
    return false;
  }) as StrategyEvent;

  // vault has no executions yet
  if (!lastExecutionEvent) {
    return undefined;
  }

  return new Date(Number(lastExecutionEvent.timestamp) / 1000000);
}
