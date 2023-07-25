import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { Strategy } from '@models/Strategy';
import { getReceiveAmount } from '@hooks/useCreateVault/buildCreateVaultParams';
import { buildPriceThreshold } from './buildPriceThreshold';
import { ConfigureVariables } from './ConfigureVariables';

jest.mock('@hooks/useCreateVault/buildCreateVaultParams');

describe('buildPriceThreshold', () => {
  // Test case 1
  it('should return minimum_receive_amount if isPriceThresholdDirty is true', () => {
    (getReceiveAmount as jest.Mock).mockReturnValue(100);

    const result = buildPriceThreshold({
      values: { priceThresholdValue: 50 } as unknown as CustomiseSchema,
      initialValues: { priceThresholdValue: 40 } as unknown as CustomiseSchema,
      context: {
        initialDenom: {},
        swapAmount: 10,
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({ minimum_receive_amount: 100 });
  });

  // Test case 2
  it('should return an empty object if isPriceThresholdDirty is false', () => {
    const result = buildPriceThreshold({
      values: { priceThresholdValue: 50 } as unknown as CustomiseSchema,
      initialValues: { priceThresholdValue: 50 } as unknown as CustomiseSchema,
      context: {
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
