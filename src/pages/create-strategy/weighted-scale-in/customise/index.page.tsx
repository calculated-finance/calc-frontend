import { getFlowLayout } from '@components/Layout';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { WeightedScaleCustomiseFormSchema } from '@models/weightedScaleFormData';
import { lazy, Suspense } from 'react';
import { TransactionType } from '@components/TransactionType';
import { WeightedScaleCustomisePage } from '@components/Forms/CustomiseForm/WeightedScaleCustomisePage';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

const ModalWrapper = lazy(() => import('@components/ModalWrapper'));

function Page() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.WeightedScaleIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.WeightedScaleIn,
      }}
    >
      <Suspense>
        <ModalWrapper stepsConfig={weightedScaleInSteps} reset={resetForm(FormNames.WeightedScaleIn)}>
          <WeightedScaleCustomisePage steps={weightedScaleInSteps} formSchema={WeightedScaleCustomiseFormSchema} />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
