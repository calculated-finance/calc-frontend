import { getProbabilityOfOutperformance } from '.';

describe('getProbabilityOfOutperformance', () => {
  it('should return null for unsupported durations', () => {
    expect(getProbabilityOfOutperformance(20)).toBeNull();
  });

  it('should return the correct probability of out-performance for supported durations', () => {
    expect(getProbabilityOfOutperformance(70)).toBe(0.96);
  });
});
