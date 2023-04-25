import getDenomInfo from '@utils/getDenomInfo';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { FiatPriceHistoryResponse } from '@hooks/useFiatPriceHistory';
import { getCompletedEvents } from '@helpers/getCompletedEvents';
import DenomIcon from '@components/DenomIcon';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { TransactionType } from '@components/TransactionType';
import usePrice from '@hooks/usePrice';
import { Chains, useChain } from '@hooks/useChain';

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
  includeLabel: boolean,
  initialDenom: any,
  resultingDenom: any,
  transactionType: TransactionType,
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
    const initialDenomName = getDenomInfo(initialDenom).name;
    const resultingDenomName = getDenomInfo(resultingDenom).name;

    const { chain } = useChain();
    const { price, pairAddress, isLoading } = usePrice(
      resultingDenom,
      initialDenom,
      transactionType,
      chain === Chains.Kujira,
    );
    const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
    const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

    if (currentPriceInTime === null) {
      return null;
    }
    return {
      date,
      price: Number((event.accumulation * currentPriceInTime).toFixed(2)),
      label: includeLabel
        ? `${initialDenomName} ➡️ ${resultingDenomName} \n Accumulated: ${event.accumulation.toFixed(
            2,
          )} ${resultingDenomName} \n 
          1 ${initialDenomName} = ${price} ${resultingDenomName} \n
          Price: $${Number(currentDisplayPriceInTime).toFixed(2)} USD \n Date: ${date
            .toLocaleDateString('en-AU', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })
            .replace(',', '')}`
        : undefined,
    };
  });

  return chartData.filter((data) => data !== null);
}

export function getChartData(
  events: StrategyEvent[] | undefined,
  fiatPrices: FiatPriceHistoryResponse['prices'] | undefined,
  transactionType: TransactionType,
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
  return [...chartData, ...(getChartDataSwaps(events, fiatPrices, false, transactionType) || [])];
}

export function getPriceData(fiatPrices: FiatPriceHistoryResponse['prices'] | undefined) {
  const chartData = fiatPrices?.map((price) => ({
    date: new Date(price[0]),
    amount: Number(price[1].toFixed(2)),
    label: `$${price[1].toFixed(2)} (${new Date(price[0]).toLocaleTimeString()})`,
  }));
  return chartData;
}
