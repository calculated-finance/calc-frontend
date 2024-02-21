import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyType } from '@models/StrategyType';
import { FormNames } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { WeightedScaleConfirmPage } from '@components/WeightedScaleConfirmPage';
import { StrategyInfoProvider } from '@hooks/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >
      <WeightedScaleConfirmPage steps={weightedScaleOutSteps} />
    </StrategyInfoProvider>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
