import { fromAtomic } from '@utils/getDenomInfo';
import { StrategyEvent } from '@hooks/StrategyEvent';
import { FiatPriceHistoryResponse } from '@hooks/useFiatPriceHistory';
import { getCompletedEvents } from '@helpers/getCompletedEvents';
import { DenomInfo } from '@utils/DenomInfo';

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
        blockHeight: event.block_height,
        time: new Date(Number(event.timestamp) / 1000000),
        accumulation: totalAmount,
        swapAmount: amount,
        swapDenom: receivedDenom.name,
        denomSent: initialDenom,
        denomAmountSent: sentAmount,
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
  const completedEvents = getCompletedEvents(events);

  if (!completedEvents || !fiatPrices || !displayPrices) {
    return null;
  }
  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents, denoms);

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
  const completedEvents = getCompletedEvents(events);

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
