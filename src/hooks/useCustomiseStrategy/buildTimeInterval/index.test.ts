import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { getExecutionInterval } from '@hooks/useCreateVault/buildCreateVaultParams';
import dcaInStrategy, { dcaPlusStrategy } from 'src/fixtures/strategy';
import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { defaultDenom } from '@utils/defaultDenom';
import { TransactionType } from '@components/TransactionType';
import { Chains } from '@hooks/useChain/Chains';
import { buildTimeInterval } from '.';

jest.mock('@hooks/useCreateVault/buildCreateVaultParams', () => ({
  getExecutionInterval: jest.fn(),
}));

const defaultContext = {
  initialDenom: { ...defaultDenom, id: '1' },
  resultingDenom: { ...defaultDenom, id: '1' },
  transactionType: TransactionType.Buy,
  swapAmount: 1,
  currentPrice: undefined,
  chain: Chains.Kujira,
};

describe('buildTimeInterval', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an empty object if isDcaPlus returns true', () => {
    const result = buildTimeInterval({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: {
        initialDenom: { ...defaultDenom, id: '1' },
        resultingDenom: { ...defaultDenom, id: '1' },
        transactionType: TransactionType.Buy,
        swapAmount: 1,
        currentPrice: undefined,
        chain: Chains.Kujira,
      },
      strategy: dcaPlusStrategy,
    });

    expect(result).toEqual({});
  });

  it('should return an object with time_interval if executionInterval or executionIntervalIncrement are different and isDcaPlus is false', () => {
    (getExecutionInterval as jest.Mock).mockReturnValue('mocked-execution-interval');

    const result = buildTimeInterval({
      values: { executionInterval: 'hourly', executionIntervalIncrement: 2 } as CustomiseSchema,
      initialValues: { executionInterval: 'daily', executionIntervalIncrement: 2 } as CustomiseSchema,
      context: defaultContext,
      strategy: dcaInStrategy,
    });

    expect(result).toEqual({ time_interval: 'mocked-execution-interval' });
  });

  it('should return an empty object if executionInterval and executionIntervalIncrement are the same and isDcaPlus is false', () => {
    const result = buildTimeInterval({
      values: { executionInterval: 'hourly', executionIntervalIncrement: 2 } as CustomiseSchema,
      initialValues: { executionInterval: 'hourly', executionIntervalIncrement: 2 } as CustomiseSchema,
      context: defaultContext,
      strategy: dcaInStrategy,
    });

    expect(result).toEqual({});
  });
});
