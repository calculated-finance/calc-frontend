import { dcaPlusStrategyViewModal } from 'src/fixtures/strategy';
import { isWeightedScale } from '.';

describe('isDcaPlus', () => {
  test('returns true for strategy with dca_plus_config property', () => {
    expect(
      isWeightedScale({
        ...dcaPlusStrategyViewModal,
        rawData: {
          ...dcaPlusStrategyViewModal.rawData,
          swap_adjustment_strategy: {
            weighted_scale: { multiplier: '1', base_receive_amount: '0', increase_only: false },
          },
        },
      }),
    ).toBe(true);
  });

  test('returns false for strategy without dca_plus_config property', () => {
    expect(isWeightedScale(dcaPlusStrategyViewModal)).toBe(false);
  });
});
