import { StrategyEvent } from '@hooks/useStrategyEvents';

export function getCompletedEvents(events: StrategyEvent[] | undefined) {
  return events?.filter((event) => {
    const { data } = event;
    if ('dca_vault_execution_completed' in data) {
      return data.dca_vault_execution_completed;
    }
    return undefined;
  });
}
