import getDenomInfo from '@utils/getDenomInfo';
import { Event } from '@hooks/useStrategyEvents';
import { FiatPriceHistoryResponse } from '@hooks/useFiatPriceHistory';

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

export const findCurrentPriceInTime = (time: Date, coingeckoData: FiatPriceHistoryResponse) => {
  let currentPrice = 0;
  try {
    coingeckoData.prices.forEach((price) => {
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

function getEventsWithAccumulation(completedEvents: Event[]) {
  let totalAmount = 0;

  return completedEvents?.map((event) => {
    const { data } = event;

    if ('dca_vault_execution_completed' in data) {
      const { conversion, name } = getDenomInfo(data.dca_vault_execution_completed.received.denom);

      const amount = conversion(Number(data.dca_vault_execution_completed.received.amount));
      totalAmount += Number(amount);
      return {
        time: new Date(Number(event.timestamp) / 1000000),
        accumulation: parseFloat(totalAmount.toFixed(2)),
        swapAmount: amount,
        swapDenom: name,
      };
    }
    throw new Error();
  });
}
function getCompletedEvents(events: Event[] | undefined) {
  return events?.filter((event) => {
    const { data } = event;
    if ('dca_vault_execution_completed' in data) {
      return data.dca_vault_execution_completed;
    }
    return undefined;
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
  events: Event[] | undefined,
  coingeckoData: FiatPriceHistoryResponse | undefined,
  includeLabel: boolean,
) {
  const completedEvents = getCompletedEvents(events);
  if (!completedEvents || !coingeckoData) {
    return null;
  }
  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents);

  const chartData = eventsWithAccumulation?.map((event) => {
    const date = new Date(event.time);
    return {
      date,
      price: Number((event.accumulation * findCurrentPriceInTime(date, coingeckoData)).toFixed(2)),
      label: includeLabel
        ? `Received ${event.swapAmount} ${event.swapDenom} at ${date.toLocaleTimeString()}`
        : undefined,
    };
  });

  return chartData;
}

export function getChartData(events: Event[] | undefined, coingeckoData: FiatPriceHistoryResponse | undefined) {
  const completedEvents = getCompletedEvents(events);

  if (!completedEvents || !coingeckoData) {
    return null;
  }

  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents);

  const chartData = coingeckoData?.prices.map((price) => ({
    date: new Date(price[0]),
    price: Number((price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)),
    label: `$${(price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)} (${new Date(
      price[0],
    ).toLocaleTimeString()})`,
  }));
  console.log(chartData);
  return [...chartData, ...(getChartDataSwaps(events, coingeckoData, false) || [])];
}
