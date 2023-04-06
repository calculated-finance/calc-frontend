import dcaInStrategy from 'src/fixtures/strategy';
import { getTotalReceived } from '..';

describe('getTotalReceived', () => {
  test('should return the correct total received amount', () => {
    const expectedTotalReceived = 1;

    expect(getTotalReceived(dcaInStrategy)).toEqual(expectedTotalReceived);
  });
  test('should round amount', () => {
    expect(
      getTotalReceived({
        ...dcaInStrategy,
        received_amount: { ...dcaInStrategy.received_amount, amount: '12345612345671234' },
      }),
    ).toEqual(12345612345.671234);
  });
});
