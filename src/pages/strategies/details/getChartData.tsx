import getDenomInfo from '@utils/getDenomInfo';
import { StrategyEvent } from '@hooks/useStrategyEvents';
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

function getEventsWithAccumulation(completedEvents: StrategyEvent[]) {
  let totalAmount = 0;

  return completedEvents?.map((event) => {
    const { data } = event;

    if ('dca_vault_execution_completed' in data) {
      const { received, fee } = data.dca_vault_execution_completed;
      const { conversion, name } = getDenomInfo(received.denom);

      const amount = conversion(Number(received.amount) - Number(fee.amount));
      totalAmount += Number(amount);
      return {
        time: new Date(Number(event.timestamp) / 1000000),
        accumulation: totalAmount,
        swapAmount: amount,
        swapDenom: name,
      };
    }
    throw new Error();
  });
}
export function getCompletedEvents(events: StrategyEvent[] | undefined) {
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
  events: StrategyEvent[] | undefined,
  fiatPrices: FiatPriceHistoryResponse['prices'] | undefined,
  includeLabel: boolean,
) {
  const completedEvents = getCompletedEvents(events);
  if (!completedEvents || !fiatPrices) {
    return null;
  }
  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents);

  const chartData = eventsWithAccumulation?.map((event) => {
    const date = new Date(event.time);
    const currentPriceInTime = findCurrentPriceInTime(date, fiatPrices);
    if (currentPriceInTime === null) {
      return null;
    }
    return {
      date,
      price: Number((event.accumulation * currentPriceInTime).toFixed(2)),
      label: includeLabel
        ? `Received ${Number(event.swapAmount.toFixed(4))} ${event.swapDenom} at ${date.toLocaleTimeString()}`
        : undefined,
    };
  });

  return chartData.filter((data) => data !== null);
}

export function getChartData(
  events: StrategyEvent[] | undefined,
  fiatPrices: FiatPriceHistoryResponse['prices'] | undefined,
) {
  const completedEvents = getCompletedEvents(events);

  if (!completedEvents || !fiatPrices) {
    return null;
  }

  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents);

  const chartData = fiatPrices?.map((price) => ({
    date: new Date(price[0]),
    price: Number((price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)),
    label: `$${(price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)} (${new Date(
      price[0],
    ).toLocaleTimeString()})`,
  }));
  return [...chartData, ...(getChartDataSwaps(events, fiatPrices, false) || [])];
}
