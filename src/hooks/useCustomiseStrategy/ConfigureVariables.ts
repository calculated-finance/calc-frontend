import { TransactionType } from '@components/TransactionType';
import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { DenomInfo } from '@utils/DenomInfo';
import { ChainId } from '@hooks/useChainId/Chains';
import { Strategy } from '@models/Strategy';

export type ConfigureVariables = {
  values: CustomiseSchema;
  initialValues: CustomiseSchema;
  context: {
    initialDenom: DenomInfo;
    swapAmount: number;
    resultingDenom: DenomInfo;
    transactionType: TransactionType;
    currentPrice: number | undefined;
    chain: ChainId;
  };
  strategy: Strategy;
};
