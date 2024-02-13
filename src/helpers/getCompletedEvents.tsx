import { StrategyEvent } from '@hooks/StrategyEvent';

export function getSwapEvents(events: StrategyEvent[] | undefined) {
  return events?.filter(({ data }) => 'dca_vault_execution_completed' in data || 'dca_vault_execution_skipped' in data);
}
