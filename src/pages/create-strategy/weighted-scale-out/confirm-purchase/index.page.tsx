import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { FormNames } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { WeightedScaleConfirmPage } from '@components/WeightedScaleConfirmPage';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider strategyInfo={{
      strategyType: StrategyTypes.WeightedScaleOut,
      transactionType: TransactionType.Sell,
      formName: FormNames.WeightedScaleOut,
    }}>
      <WeightedScaleConfirmPage
        steps={weightedScaleOutSteps}
      />
    </StrategyInfoProvider>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
