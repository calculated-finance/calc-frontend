import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyType } from '@models/StrategyType';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { ModalWrapper } from '@components/ModalWrapper';
import { WeightedScaleCustomisePage } from '@components/Forms/CustomiseForm/WeightedScaleCustomisePage';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >
      <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={resetForm(FormNames.WeightedScaleOut)}>
        <WeightedScaleCustomisePage steps={weightedScaleOutSteps} formSchema={WeightedScaleCustomiseFormSchema} />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
