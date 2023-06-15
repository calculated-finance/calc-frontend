import getDenomInfo from '@utils/getDenomInfo';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { FiatPriceHistoryResponse } from '@hooks/useFiatPriceHistory';
import { getCompletedEvents } from '@helpers/getCompletedEvents';

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

// type ExecutionSkippedReason = 'slippage_tolerance_exceeded' | 'swap_amount_adjusted_to_zero';

// function convertToSentence(reason: ExecutionSkippedReason) {
//   const sentenceMap = {
//     slippage_tolerance_exceeded: 'Slippage tolerance exceeded',
//     swap_amount_adjusted_to_zero: 'Swap amount was adjusted to zero.',
//   };

//   return sentenceMap[reason] || 'Unknown reason.';
// }

// export function getEventsWithAccumulation(events: StrategyEvent[]) {
//   let totalAmount = 0;

//   return events?.map((event) => {
//     const { data } = event;

//     if ('dca_vault_execution_completed' in data) {
//       const { received, fee } = data.dca_vault_execution_completed;
//       const { conversion, name } = getDenomInfo(received.denom);

//       const amount = conversion(Number(received.amount) - Number(fee.amount));
//       totalAmount += Number(amount);
//       return {
//         time: new Date(Number(event.timestamp) / 1000000),
//         accumulation: totalAmount,
//         swapAmount: amount,
//         swapDenom: name,
//       };
//     }
//     if ('dca_vault_execution_skipped' in data) {
//       const { reason } = data.dca_vault_execution_skipped;
//       const reasonString = convertToSentence(reason as ExecutionSkippedReason);

//       return {
//         time: new Date(Number(event.timestamp) / 1000000),
//         failed: reasonString,
//       };
//     }
//     throw new Error();
//   });
// }

export function getEventsWithAccumulation(completedEvents: StrategyEvent[]) {
  let totalAmount = 0;

  return completedEvents?.map((event) => {
    const { data } = event;

    if ('dca_vault_execution_completed' in data) {
      const { received, fee, sent } = data.dca_vault_execution_completed;
      const { conversion, name } = getDenomInfo(received.denom);
      const sentAmount = conversion(Number(sent.amount));
      const sentDenom = sent.denom;

      const amount = conversion(Number(received.amount) - Number(fee.amount));
      totalAmount += Number(amount);
      return {
        time: new Date(Number(event.timestamp) / 1000000),
        accumulation: totalAmount,
        swapAmount: amount,
        swapDenom: name,
        denomSent: sentDenom,
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
) {
  const completedEvents = getCompletedEvents(events);

  if (!completedEvents || !fiatPrices || !displayPrices) {
    return null;
  }
  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents);

  const chartData = eventsWithAccumulation?.map((event) => {
    const date = new Date(event.time);
    const currentPriceInTime = findCurrentPriceInTime(date, fiatPrices);
    const currentDisplayPriceInTime = findCurrentPriceInTime(date, displayPrices);

    if (currentPriceInTime === null) {
      return null;
    }
    return {
      date,
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
) {
  const completedEvents = getCompletedEvents(events);

  if (!completedEvents || !fiatPrices) {
    return null;
  }

  const eventsWithAccumulation = getEventsWithAccumulation(completedEvents);

  const chartData = fiatPrices?.map((price) => ({
    date: new Date(price[0]),
    marketValue: Number((price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)),
    label: `$${(price[1] * findCurrentAmountInTime(price[0], eventsWithAccumulation)).toFixed(2)} (${new Date(price[0])
      .toLocaleTimeString()
      .replace(/\b([ap]m)\b/gi, (match) => match.toUpperCase())})`,
  }));
  return [...chartData, ...(getChartDataSwaps(events, fiatPrices, displayPrices) || [])];
}

export function getPriceData(fiatPrices: FiatPriceHistoryResponse['prices'] | undefined) {
  const chartData = fiatPrices?.map((price) => ({
    date: new Date(price[0]),
    amount: Number(price[1].toFixed(2)),
    label: `$${price[1].toFixed(2)} (${new Date(price[0]).toLocaleTimeString()})`,
  }));
  return chartData;
}
