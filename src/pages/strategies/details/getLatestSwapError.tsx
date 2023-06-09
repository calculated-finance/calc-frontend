import { StrategyEvent } from '@hooks/useStrategyEvents';
import { findLastIndex } from 'lodash';
import {
  PREVIOUS_SWAP_FAILED_DUE_TO_INSUFFICIENT_FUNDS_ERROR_MESSAGE,
  PREVIOUS_SWAP_FAILED_DUE_TO_SLIPPAGE_ERROR_MESSAGE,
} from 'src/constants';
import { Strategy } from '@hooks/useStrategies';

export function getLatestSwapError(strategy: Strategy, events: StrategyEvent[] | undefined): string | undefined {
  if (!events) {
    return undefined;
  }
  const executionTriggeredIndex = findLastIndex(events, (event) => {
    const { data } = event;
    if ('dca_vault_execution_triggered' in data) {
      return true;
    }
    return false;
  });

  const executionSkippedIndex = executionTriggeredIndex + 1;

  if (executionTriggeredIndex === -1 || executionSkippedIndex >= events.length) {
    return undefined;
  }

  const { data } = events[executionSkippedIndex];

  if (!('dca_vault_execution_skipped' in data)) return undefined;

  const swapReasonMessages: Record<string, string> = {
    slippage_tolerance_exceeded: PREVIOUS_SWAP_FAILED_DUE_TO_SLIPPAGE_ERROR_MESSAGE,
    unknown_failure: PREVIOUS_SWAP_FAILED_DUE_TO_INSUFFICIENT_FUNDS_ERROR_MESSAGE,
  };

  const swapSkippedReason = data.dca_vault_execution_skipped?.reason.toString();

  return (
    (Object.keys(swapReasonMessages).includes(swapSkippedReason) && swapReasonMessages[swapSkippedReason]) || undefined
  );
}
