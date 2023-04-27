import { createDcaPlusSwapEvent, createTradSwapEvent, getCreationDate, SwapEvent } from '@helpers/strategyEvents';
import { StrategyEvent } from '@hooks/useStrategyEvents';

type AccumulatedSwapEvent = {
  time: Date;
  total: number;
  swapEvent: SwapEvent | null;
};

export function buildSwapEventsWithAccumulation(swapEvents: SwapEvent[], creationDate: Date | null) {
  const swapEventsWithAccumulation: AccumulatedSwapEvent[] = [];

  if (creationDate) {
    swapEventsWithAccumulation.push({
      time: creationDate,
      total: 0,
      swapEvent: null,
    });
  }

  swapEvents.forEach((swapEvent) => {
    const previousEvent = swapEventsWithAccumulation[swapEventsWithAccumulation.length - 1];

    swapEventsWithAccumulation.push({
      time: swapEvent.time,
      total: (previousEvent ? previousEvent.total : 0) + swapEvent.received,
      swapEvent,
    });
  });

  return swapEventsWithAccumulation;
}

export function getTotalAtTime(events: AccumulatedSwapEvent[], time: Date): number {
  if (!events.length) {
    return 0;
  }
  const eventIndex = events.findIndex((event) => event.time > time);
  if (eventIndex === -1) {
    return events[events.length - 1].total;
  }
  const prevEvent = events[eventIndex - 1];
  if (prevEvent) {
    return prevEvent.swapEvent ? prevEvent.total : 0;
  }
  return 0;
}

function filterAcculumationEventsByTime(
  swapEventsWithAccumulation: AccumulatedSwapEvent[],
  startTime: Date,
  endTime: Date,
) {
  return swapEventsWithAccumulation.filter((event) => event.time >= startTime && event.time <= endTime);
}

export function convertDcaPlusEvents(events: StrategyEvent[] | undefined) {
  if (!events) {
    return [];
  }

  const creationDate = getCreationDate(events);
  const swapEvents = events.map(createDcaPlusSwapEvent).filter((event) => event !== null) as SwapEvent[];

  return buildSwapEventsWithAccumulation(swapEvents, creationDate);
}

export function convertTradEvents(events: StrategyEvent[] | undefined) {
  if (!events) {
    return [];
  }

  const creationDate = getCreationDate(events);
  const swapEvents = events.map(createTradSwapEvent).filter((event) => event !== null) as SwapEvent[];

  return buildSwapEventsWithAccumulation(swapEvents, creationDate);
}

export function buildLineChartData(swapEventsWithAccumulation: AccumulatedSwapEvent[], startTime: Date, endTime: Date) {
  const totalAtStart = getTotalAtTime(swapEventsWithAccumulation, startTime);
  const totalAtEnd = getTotalAtTime(swapEventsWithAccumulation, endTime);

  const filteredSwapEventsWithAccumulation = filterAcculumationEventsByTime(
    swapEventsWithAccumulation,
    startTime,
    endTime,
  );

  // line chart data
  const lineChartData = filteredSwapEventsWithAccumulation.map((event) => ({
    time: event.time,
    amount: event.total,
  }));

  // add start and end points in functional way
  const lineChartDataWithStartAndEnd = [
    {
      time: startTime,
      amount: totalAtStart,
    },
    ...lineChartData,
    {
      time: endTime,
      amount: totalAtEnd,
    },
  ];

  return lineChartDataWithStartAndEnd;
}

export function buildSwapsChartData(
  swapEventsWithAccumulation: AccumulatedSwapEvent[],
  startTime: Date,
  endTime: Date,
) {
  const filteredSwapEventsWithAccumulation = filterAcculumationEventsByTime(
    swapEventsWithAccumulation,
    startTime,
    endTime,
  );

  // line chart data
  const swapsChartData = filteredSwapEventsWithAccumulation.map((event) => ({
    time: event.time,
    amount: event.total,
    label: event.swapEvent
      ? `${event.swapEvent.sent} sent.\n${event.swapEvent.received} received.\n ${event.total} total`
      : 'Created',
  }));

  return swapsChartData;
}
