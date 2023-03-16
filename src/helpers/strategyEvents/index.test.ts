import { mockStrategyEvents } from 'src/fixtures/strategyEvents';
import { createSwapEvent, getCreationDate } from '.';

describe('strategy event helpers', () => {
  describe('createSwapEvent', () => {
    it('returns a swap event if the event is a swap event', () => {
      expect(createSwapEvent(mockStrategyEvents.events[3])).toEqual({
        time: new Date('2023-03-14T01:06:51.252Z'),
        received: 0.347788,
        fee: 0.001738,
        sent: 0.333333,
      });
    });
  });

  describe('getCreationDate', () => {
    it('returns the creation date if the creation event exists', () => {
      expect(getCreationDate(mockStrategyEvents.events)).toEqual(new Date('2023-03-14T01:06:51.252Z'));
    });

    it('returns null if the creation event does not exist', () => {
      expect(getCreationDate([])).toBeNull();
    });
  });
});
