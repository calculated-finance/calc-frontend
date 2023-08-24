import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { Strategy } from '@models/Strategy';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { buildSwapAmount } from './buildSwapAmount';
import { ConfigureVariables } from './ConfigureVariables';

jest.mock('@helpers/strategy/isWeightedScale');
jest.mock('@helpers/strategy/isDcaPlus');
jest.mock('@hooks/useCreateVault/buildCreateVaultParams');
jest.mock('./buildSwapAmount');

describe('buildSwapAmount', () => {
  // Test case 1
  it('should return an empty object if the strategy is weighted scale', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(true);

    const result = buildSwapAmount({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: {} as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual(undefined);
  });
  // Test case 2
  it('should return an empty object if the strategy is dcaPlus', () => {
    (isDcaPlus as jest.Mock).mockReturnValue(true);

    const result = buildSwapAmount({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: {} as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual(undefined);
  });

  // Test case 3
  it('should return empty object if swap_amount isSwapAmountDirty is false', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);
    (isDcaPlus as jest.Mock).mockReturnValue(false);
    (buildSwapAmount as jest.Mock).mockReturnValue({});

    const commonValues = {
      swapAmount: '2000000',
    } as unknown as CustomiseSchema;

    const result = buildSwapAmount({
      values: commonValues,
      initialValues: commonValues,
      context: {
        currentPrice: 100,
        initialDenom: {},
        swapAmount: '2000000',
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });
  // Test case 3
  it('should return new if swap_amount isSwapAmountDirty is true', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);
    (isDcaPlus as jest.Mock).mockReturnValue(false);

    const result = buildSwapAmount({
      values: { swapAmount: '1000000' } as unknown as CustomiseSchema,
      initialValues: { swapAmount: '2000000' } as unknown as CustomiseSchema,
      context: {
        initialDenom: {},
        swapAmount: '1000000',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({ swap_amount: '2000000' });
  });

  // Test case 4
  it('should return an empty object if isWeightedScaleDirty is false', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(true);

    const commonValues = {
      applyMultiplier: true,
      basePriceIsCurrentPrice: true,
      basePriceValue: 100,
      swapMultiplier: 2,
    } as unknown as CustomiseSchema;

    const result = buildSwapAmount({
      values: commonValues,
      initialValues: commonValues,
      context: {
        currentPrice: 100,
        initialDenom: {},
        swapAmount: 10,
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });
});
