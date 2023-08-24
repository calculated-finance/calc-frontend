import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { buildWeightedScaleAdjustmentStrategy } from '@hooks/useCreateVault/buildCreateVaultParams';
import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { Strategy } from '@models/Strategy';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { buildSwapAmount } from './buildSwapAmount';
import { ConfigureVariables } from './ConfigureVariables';

jest.mock('@helpers/strategy/isWeightedScale');
jest.mock('@helpers/strategy/isDcaPlus');
jest.mock('@hooks/useCreateVault/buildCreateVaultParams');

describe('buildSwapAmount', () => {
  // Test case 1
  it('should return an empty object if the strategy is not a weighted scale', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(true);

    const result = buildSwapAmount({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: { currentPrice: 100 } as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });
  // Test case 1
  it('should return an empty object if the strategy is not dcaPlus', () => {
    (isDcaPlus as jest.Mock).mockReturnValue(true);

    const result = buildSwapAmount({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: { currentPrice: 100 } as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });

  // Test case 2
  it('should throw an error if current price is undefined', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);

    expect(() => {
      buildSwapAmount({
        values: {} as CustomiseSchema,
        initialValues: {} as CustomiseSchema,
        context: { currentPrice: undefined } as ConfigureVariables['context'],
        strategy: {} as Strategy,
      });
    }).toThrow('Unable to get current price. Please try again.');
  });

  // Test case 3
  it('should return swap_amount if isSwapAmountDirty is true', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(true);
    (buildWeightedScaleAdjustmentStrategy as jest.Mock).mockReturnValue({});

    const result = buildSwapAmount({
      values: { applyMultiplier: true } as unknown as CustomiseSchema,
      initialValues: { applyMultiplier: false } as unknown as CustomiseSchema,
      context: {
        currentPrice: 100,
        initialDenom: {},
        swapAmount: 10,
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({ swap_adjustment_strategy: {} });
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
