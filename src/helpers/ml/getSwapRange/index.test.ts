import { getSwapRange } from '.';

describe('getSwapRange', () => {
  it('should return null for unsupported durations', () => {
    expect(getSwapRange(100, 5, 10)).toBeNull();
  });

  it('should return the correct min and max swap amounts for supported durations', () => {
    const amounts = getSwapRange(100, 70, 10);
    expect(amounts).toEqual({ min: 63.38, max: 180 });
  });

  it('should return the correct min and max swap amounts when buy_amount is zero', () => {
    const amounts = getSwapRange(0, 70, 0);
    expect(amounts).toEqual({ min: 0, max: 0 });
  });

  it('should return the correct min and max swap amounts when min is less than miniumSwapAmount', () => {
    const amounts = getSwapRange(100, 70, 99);
    expect(amounts).toEqual({ min: 99, max: 180 });
  });
});
