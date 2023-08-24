import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { Strategy } from '@models/Strategy';
import { defaultDenom } from '@utils/defaultDenom';
import { DenomInfo } from '@utils/DenomInfo';
import { TransactionType } from '@components/TransactionType';
import { Chains } from '@hooks/useChain/Chains';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { buildSwapAmount } from './buildSwapAmount';
import { ConfigureVariables } from './ConfigureVariables';
import { getSwapAmount } from '@helpers/strategy';

jest.mock('@helpers/strategy/isWeightedScale');
jest.mock('@helpers/strategy/isDcaPlus');
jest.mock('@hooks/useCreateVault/buildCreateVaultParams');

describe('buildSwapAmount', () => {
  it('should return empty object if isSwapAmountDirty is false', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);
    (isDcaPlus as jest.Mock).mockReturnValue(false);
    // (buildSwapAmount as jest.Mock).mockReturnValue({});
    getSwapAmount as jest.Mock;

    const commonValues = {
      swapAmount: '3000000',
    } as unknown as CustomiseSchema;

    const result = buildSwapAmount({
      values: commonValues,
      initialValues: commonValues,
      context: {
        currentPrice: 100,
        initialDenom: {},
        swapAmount: '',
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });

  it.only('should return empty object if isSwapAmountDirty is true', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);
    (isDcaPlus as jest.Mock).mockReturnValue(false);
    // (buildSwapAmount as jest.Mock).mockReturnValue({});
    getSwapAmount as jest.Mock;

    const result = buildSwapAmount({
      values: { swapAmount: 3 } as CustomiseSchema,
      initialValues: { swapAmount: 1 } as CustomiseSchema,
      context: {
        swapAmount: 3,
        initialDenom: { ...defaultDenom, id: '' } as DenomInfo,
        resultingDenom: {} as DenomInfo,
        transactionType: 'some-type' as TransactionType,
        currentPrice: undefined,
        chain: {} as Chains,
      },
      strategy: {} as Strategy,
    } as ConfigureVariables);

    expect(result).toEqual({});
  });
});
