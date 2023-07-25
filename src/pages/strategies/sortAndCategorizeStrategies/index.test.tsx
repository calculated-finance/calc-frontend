import { mockStrategy } from '@helpers/test/mockStrategy';
import { StrategyStatus } from '@models/Strategy';
import { sortAndCategorizeStrategies } from './index';

describe('sortAndCategorizeStrategies', () => {
  it('correctly sorts and categorizes strategies based on their status and id', () => {
    // Define some mock strategies with different statuses and id values
    const strategies = [
      mockStrategy({ id: '3', status: StrategyStatus.ACTIVE }),
      mockStrategy({ id: '1', status: StrategyStatus.CANCELLED }),
      mockStrategy({ id: '2', status: StrategyStatus.COMPLETED }),
      mockStrategy({ id: '4', status: StrategyStatus.SCHEDULED }),
      mockStrategy({ id: '6', status: StrategyStatus.ACTIVE }),
      mockStrategy({ id: '5', status: StrategyStatus.CANCELLED }),
      mockStrategy({ id: '7', status: StrategyStatus.COMPLETED }),
      mockStrategy({ id: '8', status: StrategyStatus.SCHEDULED }),
    ];

    // Call the function with our mock strategies
    const result = sortAndCategorizeStrategies(strategies);

    // Check that the strategies are sorted and categorized correctly
    expect(result).toEqual({
      active: [
        mockStrategy({ id: '6', status: StrategyStatus.ACTIVE }),
        mockStrategy({ id: '3', status: StrategyStatus.ACTIVE }),
      ],
      scheduled: [
        mockStrategy({ id: '8', status: StrategyStatus.SCHEDULED }),
        mockStrategy({ id: '4', status: StrategyStatus.SCHEDULED }),
      ],
      completed: [
        mockStrategy({ id: '7', status: StrategyStatus.COMPLETED }),
        mockStrategy({ id: '2', status: StrategyStatus.COMPLETED }),
      ],
      cancelled: [
        mockStrategy({ id: '5', status: StrategyStatus.CANCELLED }),
        mockStrategy({ id: '1', status: StrategyStatus.CANCELLED }),
      ],
    });
  });

  it('correctly handles an empty array of strategies', () => {
    // Call the function with an empty array
    const result = sortAndCategorizeStrategies([]);

    // Check that the result is an object with empty arrays for each category
    expect(result).toEqual({
      active: [],
      scheduled: [],
      completed: [],
      cancelled: [],
    });
  });

  it('correctly handles an undefined array of strategies', () => {
    // Call the function with undefined
    const result = sortAndCategorizeStrategies(undefined);

    // Check that the result is an object with empty arrays for each category
    expect(result).toEqual({
      active: [],
      scheduled: [],
      completed: [],
      cancelled: [],
    });
  });
});
