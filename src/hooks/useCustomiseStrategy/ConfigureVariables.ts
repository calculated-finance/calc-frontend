import { TransactionType } from '@components/TransactionType';
import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { DenomInfo } from '@utils/DenomInfo';
import { Chains } from '@hooks/useChain/Chains';
import { Strategy } from '../useStrategies';

export type ConfigureVariables = {
  values: CustomiseSchema;
  initialValues: CustomiseSchema;
  context: {
    initialDenom: DenomInfo;
    swapAmount: number;
    resultingDenom: DenomInfo;
    transactionType: TransactionType;
    currentPrice: number | undefined;
    chain: Chains
  };
  strategy: Strategy;
};
