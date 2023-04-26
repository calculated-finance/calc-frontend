import { TestnetDenoms } from '@models/Denom';
import { getChartData } from './getChartData';

const mockEventData = {
  dca_vault_execution_completed: {
    fee: {
      denom: TestnetDenoms.AXL,
      amount: '1',
    },
    received: {
      denom: TestnetDenoms.AXL,
      amount: '1',
    },
    sent: {
      denom: TestnetDenoms.AXL,
      amount: '1',
    },
  },
};

const mockEvent = {
  block_height: 1,
  data: mockEventData,
  id: 1,
  resource_id: '123',
  timestamp: '1',
};

function buildEvent(time: number, swap: number) {
  // convert to hours
  const hoursToAdd = time * 1000 * 60 * 60;
  const timestamp = new Date('2021-01-01').getTime() + hoursToAdd; // hours;

  return {
    ...mockEvent,
    timestamp: (timestamp * 1000000).toString(),
    data: {
      dca_vault_execution_completed: {
        ...mockEventData.dca_vault_execution_completed,
        received: {
          ...mockEventData.dca_vault_execution_completed.received,
          amount: (swap * 1000000).toString(),
        },
      },
    },
  };
}

function buildPrice(time: number, price: number) {
  const hoursToAdd = time * 1000 * 60 * 60;

  const priceTimesOffset = 0.5 * 1000 * 60 * 60; // 30 mins
  const timestamp = new Date('2021-01-01').getTime() + hoursToAdd + priceTimesOffset;
  return [timestamp, price];
}

const mockPrices = [
  buildPrice(0, 1),
  buildPrice(1, 2),
  buildPrice(2, 1),
  buildPrice(3, 3),
  buildPrice(4, 2),
  buildPrice(5, 1),
];

describe('getChartData', () => {
  it('should return null if no events', () => {
    const result = getChartData(undefined, undefined, undefined);
    expect(result).toBeNull();
  });
  it('should return null if no coingeckoData', () => {
    const result = getChartData([], undefined, []);
    expect(result).toBeNull();
  });
  it('should return empty array if no completed events', () => {
    const result = getChartData([], [], []);
    expect(result).toEqual([]);
  });

  it('should return chart data', () => {
    const result = getChartData([buildEvent(2, 10), buildEvent(4, 12)], mockPrices, mockPrices);
    expect(result).toEqual([
      {
        date: new Date('2021-01-01T00:30:00.000Z'),
        marketValue: 0,
        label: '$0.00 (12:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T01:30:00.000Z'),
        marketValue: 0,
        label: '$0.00 (1:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T02:30:00.000Z'),
        marketValue: 10,
        label: '$10.00 (2:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T03:30:00.000Z'),
        marketValue: 30,
        label: '$30.00 (3:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T04:30:00.000Z'),
        marketValue: 44,
        label: '$44.00 (4:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T05:30:00.000Z'),
        marketValue: 22,
        label: '$22.00 (5:30:00 AM)',
      },
      {
        currentPrice: 2,
        date: new Date('2021-01-01T02:00:00.000Z'),
        marketValue: 20,
        event: {
          time: new Date('2021-01-01T02:00:00.000Z'),
          accumulation: 9.999999,
          swapAmount: 9.999999,
          swapDenom: 'axlUSDC',
        },
      },
      {
        currentPrice: 3,
        date: new Date('2021-01-01T04:00:00.000Z'),
        marketValue: 66,
        event: {
          time: new Date('2021-01-01T04:00:00.000Z'),
          accumulation: 21.999998,
          swapAmount: 11.999999,
          swapDenom: 'axlUSDC',
        },
      },
    ]);
  });

  it('should return swaps that exist after the price  data starts', () => {
    const result = getChartData(
      [buildEvent(2, 10), buildEvent(4, 12)],
      [buildPrice(3, 3), buildPrice(4, 2), buildPrice(5, 1)],
      [buildPrice(3, 3), buildPrice(4, 2), buildPrice(5, 1)],
    );
    expect(result).toEqual([
      {
        date: new Date('2021-01-01T03:30:00.000Z'),
        marketValue: 30,
        label: '$30.00 (3:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T04:30:00.000Z'),
        marketValue: 44,
        label: '$44.00 (4:30:00 AM)',
      },
      {
        date: new Date('2021-01-01T05:30:00.000Z'),
        marketValue: 22,
        label: '$22.00 (5:30:00 AM)',
      },
      {
        currentPrice: 3,
        date: new Date('2021-01-01T04:00:00.000Z'),
        marketValue: 66,
        event: {
          time: new Date('2021-01-01T04:00:00.000Z'),
          accumulation: 21.999998,
          swapAmount: 11.999999,
          swapDenom: 'axlUSDC',
        },
      },
    ]);
  });
});
