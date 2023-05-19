import { getFlowLayout } from '@components/Layout';
import { FormNames } from 'src/hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { StrategyTypes } from '@models/StrategyTypes';
import { WeightedScaleConfirmPage } from '@components/WeightedScaleConfirmPage';

function Page() {
  return (
    <WeightedScaleConfirmPage
      formName={FormNames.WeightedScaleIn}
      steps={weightedScaleInSteps}
      transactionType={TransactionType.Buy}
      strategyType={StrategyTypes.WeightedScaleIn}
    />
  );
}
Page.getLayout = getFlowLayout;

export default Page;
