import { createSwapEvent, getCreationDate, SwapEvent } from '@helpers/strategyEvents';
import { Strategy } from '@hooks/useStrategies';
import { StrategyEvent } from '@hooks/useStrategyEvents';

type AccumulatedSwapEvent = {
  time: Date;
  total: number;
  swapEvent: SwapEvent | null;
};

export function buildSwapEventsWithAccumulation(
  swapEvents: SwapEvent[],
  creationDate: Date,
  startTime: Date,
  endTime: Date,
) {
  // create initial event for creation, if in range

  const swapEventsWithAccumulation: AccumulatedSwapEvent[] = [];

  if (creationDate >= startTime && creationDate <= endTime) {
    swapEventsWithAccumulation.push({
      time: creationDate,
      total: 0,
      swapEvent: null,
    });
  }

  // filter to swap events within the range
  const filteredSwapEvents = swapEvents.filter((event) => event.time >= startTime && event.time <= endTime);

  filteredSwapEvents.forEach((swapEvent) => {
    // safely
    const previousEvent = swapEventsWithAccumulation[swapEventsWithAccumulation.length - 1];

    swapEventsWithAccumulation.push({
      time: swapEvent.time,
      total: (previousEvent ? previousEvent.total : 0) + swapEvent.received,
      swapEvent,
    });
  });

  return swapEventsWithAccumulation;
}

export function buildChartData(swapEventsWithAccumulation: AccumulatedSwapEvent[]) {
  return swapEventsWithAccumulation.map((event) => ({
    time: event.time,
    amount: event.total,
    label: event.swapEvent ? `${event.swapEvent.received} received. ${event.total} total` : 'Created',
  }));
}

export function buildChartDataFromEventData(events: StrategyEvent[] | undefined, startTime: Date, endTime: Date) {
  if (!events) {
    return [];
  }

  const creationDate = getCreationDate(events);
  const swapEvents = events.map(createSwapEvent).filter((event) => event !== null) as SwapEvent[];

  if (!creationDate) {
    return [];
  }

  const swapEventsWithAccumulation = buildSwapEventsWithAccumulation(swapEvents, creationDate, startTime, endTime);
  return buildChartData(swapEventsWithAccumulation);
}
