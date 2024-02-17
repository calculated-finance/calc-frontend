import { getFlowLayout } from '@components/Layout';
import { FormNames } from 'src/hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { StrategyType } from '@models/StrategyType';
import { WeightedScaleConfirmPage } from '@components/WeightedScaleConfirmPage';
import { StrategyInfoProvider } from '@hooks/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.WeightedScaleIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.WeightedScaleIn,
      }}
    >
      <WeightedScaleConfirmPage steps={weightedScaleInSteps} />
    </StrategyInfoProvider>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
