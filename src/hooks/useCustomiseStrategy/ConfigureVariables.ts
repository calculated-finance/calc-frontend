import { TransactionType } from '@components/TransactionType';
import { CustomiseSchema } from 'src/pages/strategies/customise/CustomiseSchemaDca';
import { InitialDenomInfo, ResultingDenomInfo } from '@utils/DenomInfo';
import { ChainId } from '@models/ChainId';
import { Strategy } from '@models/Strategy';

export type ConfigureVariables = {
  values: CustomiseSchema;
  initialValues: CustomiseSchema;
  context: {
    initialDenom: InitialDenomInfo;
    swapAmount: number;
    resultingDenom: ResultingDenomInfo;
    transactionType: TransactionType;
    currentPrice: number | undefined;
    chain: ChainId;
  };
  strategy: Strategy;
};
