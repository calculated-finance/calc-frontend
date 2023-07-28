import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import { Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { InvalidData } from '@components/InvalidData';
import { DcaPlusPostPurchaseFormSchema } from '@models/dcaPlusFormData';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { useDenom } from '@hooks/useDenom/useDenom';
import React, { Suspense } from 'react';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

const ModalWrapper = React.lazy(() =>
  import('@components/ModalWrapper').then((module) => ({ default: module.ModalWrapper })),
);

function Page() {
  const { actions, state, context } = useDcaInFormPostPurchase();
  const steps = dcaPlusOutSteps;
  const { nextStep, goToStep } = useSteps(steps);

  const { validate } = useValidation(DcaPlusPostPurchaseFormSchema);

  const onSubmit = async (formData: DcaInFormDataPostPurchase) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const resultingDenom = useDenom(context?.resultingDenom);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {state && context ? (
        <PostPurchaseForm resultingDenom={resultingDenom} />
      ) : (
        <InvalidData onRestart={handleRestart} />
      )}
    </Formik>
  );
}

function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAPlusOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaPlusOut,
      }}
    >
      <Suspense>
        <ModalWrapper stepsConfig={dcaPlusOutSteps} reset={resetForm(FormNames.DcaPlusOut)}>
          <Page />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
