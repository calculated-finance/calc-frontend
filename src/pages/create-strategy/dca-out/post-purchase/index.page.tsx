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
import { useDenom } from '@hooks/useDenom/useDenom';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { actions, state, context } = useDcaInFormPostPurchase();
  const steps = dcaOutSteps;

  const { nextStep, goToStep } = useSteps(steps);
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(postPurchaseValidationSchema);

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
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader
            stepsConfig={dcaOutSteps}
            resetForm={actions.resetAction}
            cancelUrl="/create-strategy"
          />
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            {state && context ? (
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
        strategyType: StrategyTypes.DCAOut,
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
