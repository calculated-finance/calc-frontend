import { getFlowLayout } from '@components/Layout';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { lazy, Suspense } from 'react';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { WeightedScaleCustomisePage } from '@components/Forms/CustomiseForm/WeightedScaleCustomisePage';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

const ModalWrapper = lazy(() => import('@components/ModalWrapper'));

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >
      <Suspense>
        <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={resetForm(FormNames.WeightedScaleOut)}>
          <WeightedScaleCustomisePage steps={weightedScaleOutSteps} formSchema={WeightedScaleCustomiseFormSchema} />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
