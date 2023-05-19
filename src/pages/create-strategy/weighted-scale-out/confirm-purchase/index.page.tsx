import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { FormNames } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { WeightedScaleConfirmPage } from '@components/WeightedScaleConfirmPage';

function Page() {
  return (
    <WeightedScaleConfirmPage
      formName={FormNames.WeightedScaleOut}
      steps={weightedScaleOutSteps}
      transactionType={TransactionType.Sell}
      strategyType={StrategyTypes.WeightedScaleOut}
    />
  );
}
Page.getLayout = getFlowLayout;

export default Page;
