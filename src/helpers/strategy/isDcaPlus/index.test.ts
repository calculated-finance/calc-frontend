import { dcaInStrategyViewModal, dcaPlusStrategyViewModal } from 'src/fixtures/strategy';
import { isDcaPlus } from '.';

describe('isDcaPlus', () => {
  test('returns true for strategy with dca_plus_config property', () => {
    expect(isDcaPlus(dcaPlusStrategyViewModal)).toBe(true);
  });

  test('returns false for strategy without dca_plus_config property', () => {
    expect(isDcaPlus(dcaInStrategyViewModal)).toBe(false);
  });
});
