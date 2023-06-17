import { getFlowLayout } from '@components/Layout';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { TransactionType } from '@components/TransactionType';
import { ModalWrapper } from '@components/ModalWrapper';
import { WeightedScaleCustomisePage } from '@components/Forms/CustomiseForm/WeightedScaleCustomisePage';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider strategyInfo={{
      strategyType: StrategyTypes.WeightedScaleIn,
      transactionType: TransactionType.Buy,
      formName: FormNames.WeightedScaleIn,
    }}>
      <ModalWrapper stepsConfig={weightedScaleInSteps} reset={resetForm(FormNames.WeightedScaleIn)}>
        <WeightedScaleCustomisePage
          steps={weightedScaleInSteps}
          formSchema={WeightedScaleCustomiseFormSchema}
        />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
