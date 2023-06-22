import { FiatPriceHistoryResponse } from '@hooks/useFiatPriceHistory';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { findCurrentPriceInTime } from './getChartData';

type ExecutionSkippedReason = 'slippage_tolerance_exceeded' | 'swap_amount_adjusted_to_zero';

function convertToSentence(reason: ExecutionSkippedReason) {
  const sentenceMap = {
    slippage_tolerance_exceeded: 'Slippage tolerance exceeded',
    swap_amount_adjusted_to_zero: 'Swap amount was adjusted to zero.',
  };

  return sentenceMap[reason] || 'Failed swap';
}

function getFailedEventsWithAccumulation(failedEvents: StrategyEvent[] | undefined) {
  return failedEvents?.map((event) => {
    const { data } = event;

    if ('dca_vault_execution_skipped' in data) {
      const { reason } = data.dca_vault_execution_skipped;
      const reasonString = convertToSentence(reason as ExecutionSkippedReason);

      return {
        time: new Date(Number(event.timestamp) / 1000000),
        failed: reasonString,
      };
    }
    throw new Error();
  });
}

function getFailedEvents(events: StrategyEvent[] | undefined) {
  return events?.filter((event) => {
    const { data } = event;
    if ('dca_vault_execution_skipped' in data) {
      return data.dca_vault_execution_skipped;
    }
    return undefined;
  });
}

export function getFailedChartDataSwaps(
  events: StrategyEvent[] | undefined,
  fiatPrices: FiatPriceHistoryResponse['prices'] | undefined,
  displayPrices: FiatPriceHistoryResponse['prices'] | undefined,
) {
  const failedEvents = getFailedEvents(events);

  if (!failedEvents || !fiatPrices || !displayPrices) {
    return null;
  }
  const eventsWithAccumulation = getFailedEventsWithAccumulation(failedEvents);

  const chartData = eventsWithAccumulation?.map((event) => {
    const date = new Date(event.time);
    const currentDisplayPriceInTime = findCurrentPriceInTime(date, displayPrices);
    if (!currentDisplayPriceInTime) {
      return null;
    }
    return {
      date,
      marketValue: 0,
      currentPrice: currentDisplayPriceInTime,
      event,
    };
  });
  if (!chartData) {
    return null;
  }
  return chartData.filter((data) => data !== null);
}
