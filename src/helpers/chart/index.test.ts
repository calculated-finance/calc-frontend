import { buildSwapEventsWithAccumulation } from '.';

describe('buildSwapEventsWithAccumulation', () => {
  const creationDate = new Date('2022-01-01T00:00:00Z');
  const swapEvents = [
    { time: new Date('2022-01-02T00:00:00Z'), received: 10, fee: 1, sent: 2 },
    { time: new Date('2022-01-03T00:00:00Z'), received: 20, fee: 2, sent: 4 },
    { time: new Date('2022-01-04T00:00:00Z'), received: 30, fee: 3, sent: 6 },
  ];

  it('returns an array of accumulated swap events', () => {
    const result = buildSwapEventsWithAccumulation(swapEvents, creationDate);

    // check that the result is an array of the expected length
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(swapEvents.length + 1);

    // check that the first event has a total of 0 and a null swap event
    expect(result[0].time).toEqual(creationDate);
    expect(result[0].total).toBe(0);
    expect(result[0].swapEvent).toBeNull();

    // check that the subsequent events have the expected totals and swap events
    expect(result[1].time).toEqual(swapEvents[0].time);
    expect(result[1].total).toBe(10);
    expect(result[1].swapEvent).toEqual(swapEvents[0]);

    expect(result[2].time).toEqual(swapEvents[1].time);
    expect(result[2].total).toBe(30);
    expect(result[2].swapEvent).toEqual(swapEvents[1]);

    expect(result[3].time).toEqual(swapEvents[2].time);
    expect(result[3].total).toBe(60);
    expect(result[3].swapEvent).toEqual(swapEvents[2]);
  });

  it('returns a single event for the creation date if no swap events are provided', () => {
    const result = buildSwapEventsWithAccumulation([], creationDate);

    // check that the result is an array with a single event
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);

    // check that the event has a total of 0 and a null swap event
    expect(result[0].total).toBe(0);
    expect(result[0].swapEvent).toBeNull();
  });
});
