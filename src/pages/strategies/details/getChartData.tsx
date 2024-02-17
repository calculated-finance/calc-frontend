import { fromAtomic } from '@utils/getDenomInfo';
import { StrategyEvent } from '@models/StrategyEvent';
import { FiatPriceHistoryResponse } from '@hooks/useFiatPriceHistory';
import { getSwapEvents } from '@helpers/getCompletedEvents';
import { DenomInfo } from '@utils/DenomInfo';
import { ExecutionSkippedReason } from 'src/interfaces/v2/generated/response/get_events';

type EventWithAccumulation = {
  time: Date;
  accumulation: number;
};

class BreakException extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, BreakException.prototype);
  }
}

export const findCurrentPriceInTime = (time: Date, fiatPrices: FiatPriceHistoryResponse['prices']) => {
  let currentPrice = null;
  try {
    fiatPrices.forEach((price) => {
      if (new Date(price[0]) > time) {
        throw BreakException;
      }
      [, currentPrice] = price;
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  return currentPrice;
};

function convertToSentence(reason: ExecutionSkippedReason) {
  const sentenceMap = {
    slippage_query_error: 'Slippage tolerance exceeded',
    slippage_tolerance_exceeded: 'Slippage tolerance exceeded',
    swap_amount_adjusted_to_zero: 'Swap amount was adjusted to zero.',
  };

  return typeof reason === 'string'
    ? sentenceMap[reason]
    : 'price_threshold_exceeded' in reason
    ? 'Price threshold exceeded'
    : reason.unknown_error.msg;
}

export function getEventsWithAccumulation(completedEvents: StrategyEvent[], denoms: { [x: string]: DenomInfo }) {
  let totalAmount = 0;

  return completedEvents?.map((event) => {
    const { data } = event;

    if ('dca_vault_execution_completed' in data) {
      const { received, fee, sent } = data.dca_vault_execution_completed;
      const receivedDenom = denoms[received.denom];
      const initialDenom = denoms[sent.denom];
      const sentAmount = fromAtomic(initialDenom, Number(sent.amount));

      const amount = fromAtomic(receivedDenom, Number(received.amount) - Number(fee.amount));
      totalAmount += Number(amount);

      return {
        type: 'dca_vault_execution_completed',
        blockHeight: event.block_height,
        time: new Date(Number(event.timestamp) / 1000000),
        accumulation: totalAmount,
        swapAmount: amount,
        swapDenom: receivedDenom.name,
        denomSent: initialDenom,
        denomAmountSent: sentAmount,
      };
    }

    if ('dca_vault_execution_skipped' in data) {
      return {
        type: 'dca_vault_execution_skipped',
        blockHeight: event.block_height,
        time: new Date(Number(event.timestamp) / 1000000),
        failed: convertToSentence(data.dca_vault_execution_skipped.reason as ExecutionSkippedReason),
        accumulation: totalAmount,
      };
    }

    throw new Error();
  });
}
export const findCurrentAmountInTime = (time: number, events: EventWithAccumulation[]) => {
  let currentAmount = 0;
  try {
    events.forEach((event) => {
      if (event.time > new Date(time)) {
        throw BreakException;
      }
      currentAmount = event.accumulation;
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  return currentAmount;
};

export function getChartDataSwaps(
  events: StrategyEvent[] | undefined,
  fiatPrices: FiatPriceHistoryResponse['prices'] | undefined,
  displayPrices: FiatPriceHistoryResponse['prices'] | undefined,
  denoms: { [x: string]: DenomInfo },
) {
  const swapEvents = getSwapEvents(events);

  if (!swapEvents || !fiatPrices || !displayPrices) {
    return [];
  }

  const eventsWithAccumulation = getEventsWithAccumulation(swapEvents, denoms);

  const chartData = eventsWithAccumulation?.map((event) => {
    const date = new Date(event.time);
    const currentPriceInTime = findCurrentPriceInTime(date, fiatPrices);
    const currentDisplayPriceInTime = findCurrentPriceInTime(date, displayPrices);

    if (currentPriceInTime === null) {
      return null;
    }

    return {
      date,
      blockHeight: event.blockHeight,
      marketValue: Number((event.accumulation * currentPriceInTime).toFixed(2)),
      currentPrice: currentDisplayPriceInTime,
      event,
    };
  });

  return chartData.filter((data) => data !== null);
}

export function getChartData(
  events: StrategyEvent[] | undefined,
  fiatPrices: FiatPriceHistoryResponse['prices'] | undefined,
  displayPrices: FiatPriceHistoryResponse['prices'] | undefined,
  denoms: { [x: string]: DenomInfo },
) {
  const completedEvents = getSwapEvents(events);

  if (!completedEvents || !fiatPrices) {
    return null;
  }

  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents, denoms);

  const chartData = fiatPrices?.map((price) => ({
    date: new Date(price[0]),
    marketValue: Number((price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)),
    label: `$${(price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)} (${new Date(price[0])
      .toLocaleTimeString()
      .replace(/\b([ap]m)\b/gi, (match) => match.toUpperCase())})`,
  }));
  return [...chartData, ...(getChartDataSwaps(events, fiatPrices, displayPrices, denoms) || [])];
}

export function getPriceData(fiatPrices: FiatPriceHistoryResponse['prices'] | undefined) {
  const chartData = fiatPrices?.map((price) => ({
    date: new Date(price[0]),
    amount: Number(price[1].toFixed(2)),
    label: `$${price[1].toFixed(2)} (${new Date(price[0]).toLocaleTimeString()})`,
  }));
  return chartData;
}
