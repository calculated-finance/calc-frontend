import { buildSlippageTolerance } from './buildSlippageTolerance'; // adjust this import to your file structure

describe('buildSlippageTolerance', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an object with slippage_tolerance if slippageTolerance is different from initialSlippageTolerance', () => {
    const result = buildSlippageTolerance(10, 20);

    expect(result).toEqual({ slippage_tolerance: '0.01' });
  });

  it('should return an empty object if slippageTolerance is the same as initialSlippageTolerance', () => {
    const result = buildSlippageTolerance(10, 10);

    expect(result).toEqual({});
  });
});
