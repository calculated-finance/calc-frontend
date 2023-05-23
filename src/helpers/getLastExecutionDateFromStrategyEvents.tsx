import { Event } from 'src/interfaces/v1/generated/response/get_events_by_resource_id';
import { findLast } from 'lodash';

export function getLastExecutionDateFromStrategyEvents(events: Event[]) {
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
