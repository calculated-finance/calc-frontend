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

export function getChartData(events: Event[] | undefined, coingeckoData: FiatPriceHistoryResponse | undefined) {
  const completedEvents = events?.filter((event) => {
    const { data } = event;
    if ('dca_vault_execution_completed' in data) {
      return data.dca_vault_execution_completed;
    }
    return undefined;
  });

  if (!completedEvents || !coingeckoData) {
    return null;
  }

  let totalAmount = 0;

  const eventsWithAccumulation = completedEvents?.map((event) => {
    const { data } = event;

    if ('dca_vault_execution_completed' in data) {
      const { conversion } = getDenomInfo(data.dca_vault_execution_completed.received.denom);

      const amount = conversion(Number(data.dca_vault_execution_completed.received.amount));
      totalAmount += Number(amount);
      return {
        time: new Date(Number(event.timestamp) / 1000000),
        accumulation: totalAmount,
      };
    }
    throw new Error();
  });

  const chartData = coingeckoData?.prices.map((price) => ({
    date: new Date(price[0]),
    price: price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation),
    label: `$${(price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)} (${new Date(
      price[0],
    ).toLocaleTimeString()})`,
  }));
  return chartData;
}
