import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { Strategy } from '@models/Strategy';
import { defaultDenom } from '@utils/defaultDenom';
import { DenomInfo } from '@utils/DenomInfo';
import { TransactionType } from '@components/TransactionType';
import { ChainId } from '@hooks/useChainId/Chains';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { getSwapAmount } from '@hooks/useCreateVault/buildCreateVaultParams';
import { buildSwapAmount } from './buildSwapAmount';
import { ConfigureVariables } from './ConfigureVariables';

jest.mock('@helpers/strategy/isWeightedScale');
jest.mock('@helpers/strategy/isDcaPlus');

describe('buildSwapAmount', () => {
  it('should return empty object if isWeightedScale true', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(true);

    const result = buildSwapAmount({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: {
        currentPrice: 100,
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        swapAmount: '',
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });

  it('should return empty object if isDcaPlus true', () => {
    (isDcaPlus as jest.Mock).mockReturnValue(true);

    const result = buildSwapAmount({
      values: {} as CustomiseSchema,
      initialValues: {} as CustomiseSchema,
      context: {
        currentPrice: 100,
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        swapAmount: '',
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });

  it('should return empty object if isSwapAmountDirty is false', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);
    (isDcaPlus as jest.Mock).mockReturnValue(false);
    getSwapAmount as jest.Mock;

    const commonValues = {
      swapAmount: '3000000',
    } as unknown as CustomiseSchema;

    const result = buildSwapAmount({
      values: commonValues,
      initialValues: commonValues,
      context: {
        currentPrice: 100,
        initialDenom: { ...defaultDenom, id: 'ukuji' },
        swapAmount: '',
        resultingDenom: {},
        transactionType: 'someType',
      } as unknown as ConfigureVariables['context'],
      strategy: {} as Strategy,
    });

    expect(result).toEqual({});
  });

  it('should return new swapAmount if isSwapAmountDirty is true', () => {
    (isWeightedScale as jest.Mock).mockReturnValue(false);
    (isDcaPlus as jest.Mock).mockReturnValue(false);
    buildSwapAmount as jest.Mock;
    getSwapAmount as jest.Mock;

    const initialDenom: DenomInfo = {
      ...defaultDenom,
      id: 'ukuji',
    };

    const result = buildSwapAmount({
      values: { swapAmount: 3 } as CustomiseSchema,
      initialValues: { swapAmount: 1 } as CustomiseSchema,
      context: {
        swapAmount: 3,
        initialDenom,
        resultingDenom: {} as DenomInfo,
        transactionType: 'some-type' as TransactionType,
        currentPrice: undefined,
        chain: {} as ChainId,
      },
      strategy: {} as Strategy,
    } as ConfigureVariables);

    expect(result).toEqual({ swap_amount: '3000000' });
  });
});
