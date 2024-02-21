import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase, postPurchaseValidationSchema } from 'src/models/DcaInFormData';
import { useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { InvalidData } from '@components/InvalidData';
import dcaOutSteps from '@formConfig/dcaOut';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { FormNames } from '@hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { StrategyType } from '@models/StrategyType';
import { StrategyInfoProvider } from '@hooks/useStrategyInfo';

function Page() {
  const { actions, state, context } = useDcaInFormPostPurchase();
  const steps = dcaOutSteps;

  const { nextStep, goToStep } = useSteps(steps);
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(postPurchaseValidationSchema);

  const onSubmit = (formData: DcaInFormDataPostPurchase) => {
    actions.updateAction(formData);
    nextStep();
  };

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const resultingDenom = context?.resultingDenom;

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader
            stepsConfig={dcaOutSteps}
            resetForm={actions.resetAction}
            cancelUrl="/create-strategy"
          />
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            {state && context && resultingDenom ? (
              <PostPurchaseForm resultingDenom={resultingDenom} />
            ) : (
              <InvalidData onRestart={handleRestart} />
            )}
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

function PageWrapper() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyType.DCAOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaOut,
      }}
    >
      <Page />
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
