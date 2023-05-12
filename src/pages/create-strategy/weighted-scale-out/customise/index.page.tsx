import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { FormNames } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { WeightedScaleCustomisePage } from '../../weighted-scale-in/customise/index.page';

function Page() {
  return (
    <WeightedScaleCustomisePage
      formName={FormNames.WeightedScaleOut}
      steps={weightedScaleOutSteps}
      strategyType={StrategyTypes.WeightedScaleOut}
      transactionType={TransactionType.Sell}
      formSchema={WeightedScaleCustomiseFormSchema}
    />
  );
}

Page.getLayout = getFlowLayout;

export default Page;
