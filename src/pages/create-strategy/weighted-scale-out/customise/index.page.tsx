import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { ModalWrapper } from '@components/ModalWrapper';
import { WeightedScaleCustomisePage } from '@components/Forms/CustomiseForm/WeightedScaleCustomisePage';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={resetForm(FormNames.WeightedScaleOut)}>
      <WeightedScaleCustomisePage
        formName={FormNames.WeightedScaleOut}
        steps={weightedScaleOutSteps}
        strategyType={StrategyTypes.WeightedScaleOut}
        transactionType={TransactionType.Sell}
        formSchema={WeightedScaleCustomiseFormSchema}
      />
    </ModalWrapper>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
