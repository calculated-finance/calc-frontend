import { getFlowLayout } from '@components/Layout';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { TransactionType } from '@components/TransactionType';
import { ModalWrapper } from '@components/ModalWrapper';
import { WeightedScaleCustomisePage } from '@components/Forms/CustomiseForm/WeightedScaleCustomisePage';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={weightedScaleInSteps} reset={resetForm(FormNames.WeightedScaleIn)}>
      <WeightedScaleCustomisePage
        formName={FormNames.WeightedScaleIn}
        steps={weightedScaleInSteps}
        strategyType={StrategyTypes.WeightedScaleIn}
        transactionType={TransactionType.Buy}
        formSchema={WeightedScaleCustomiseFormSchema}
      />
    </ModalWrapper>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
