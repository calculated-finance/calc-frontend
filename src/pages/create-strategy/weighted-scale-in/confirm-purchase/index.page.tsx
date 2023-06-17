import { getFlowLayout } from '@components/Layout';
import { FormNames } from 'src/hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { StrategyTypes } from '@models/StrategyTypes';
import { WeightedScaleConfirmPage } from '@components/WeightedScaleConfirmPage';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  return (
    <StrategyInfoProvider strategyInfo={{
      strategyType: StrategyTypes.WeightedScaleIn,
      transactionType: TransactionType.Buy,
      formName: FormNames.WeightedScaleIn,
    }}>
      <WeightedScaleConfirmPage
        steps={weightedScaleInSteps}
      />
    </StrategyInfoProvider>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
