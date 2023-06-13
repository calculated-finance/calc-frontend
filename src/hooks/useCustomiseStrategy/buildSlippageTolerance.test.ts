import { getSlippageTolerance } from '@hooks/useCreateVault/buildCreateVaultParams';
import { buildSlippageTolerance } from './buildSlippageTolerance'; // adjust this import to your file structure

jest.mock('@hooks/useCreateVault/buildCreateVaultParams', () => ({
  getSlippageTolerance: jest.fn(),
}));

describe('buildSlippageTolerance', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an object with slippage_tolerance if slippageTolerance is different from initialSlippageTolerance', () => {
    (getSlippageTolerance as jest.Mock).mockReturnValue('mocked-slippage-tolerance');

    const result = buildSlippageTolerance(10, 20);

    expect(result).toEqual({ slippage_tolerance: 'mocked-slippage-tolerance' });
    expect(getSlippageTolerance).toHaveBeenCalledWith(true, 10);
  });

  it('should return an empty object if slippageTolerance is the same as initialSlippageTolerance', () => {
    const result = buildSlippageTolerance(10, 10);

    expect(result).toEqual({});
    expect(getSlippageTolerance).not.toHaveBeenCalled();
  });
});
