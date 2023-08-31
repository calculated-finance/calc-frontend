import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { InvalidData } from '@components/InvalidData';
import { useDenom } from '@hooks/useDenom/useDenom';
import { TransactionType } from '@components/TransactionType';
import { useControlDeskFormPostPurchase } from 'src/pages/control-desk/useOnceOffForm';
import onceOffSteps from 'src/pages/control-desk/onceOffForm';
import { ControlDeskFormDataPostPurchase, postPurchaseValidationSchemaControlDesk } from 'src/pages/control-desk/Components/ControlDeskForms';
import { ControlDeskStrategyInfoProvider } from 'src/pages/control-desk/useControlDeskStrategyInfo';
import { ControlDeskFormNames } from 'src/pages/control-desk/useControlDeskFormStore';
import { ControlDeskStrategyTypes } from 'src/pages/control-desk/Components/ControlDeskStrategyTypes';
import { PostPurchaseFormOnceOff } from 'src/pages/control-desk/Components/PostPurchaseFormOnceOff';

function Page() {
  const { actions, state, context } = useControlDeskFormPostPurchase();

  const { nextStep, goToStep } = useSteps(onceOffSteps);
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(postPurchaseValidationSchemaControlDesk);

  const onSubmit = async (formData: ControlDeskFormDataPostPurchase) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  console.log(state)

  const resultingDenom = useDenom(context?.resultingDenom);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader
            stepsConfig={onceOffSteps}
            resetForm={actions.resetAction}
            cancelUrl="/control-desk/create-strategy"
          />
          <NewStrategyModalBody stepsConfig={onceOffSteps} isLoading={isPageLoading && !isSubmitting}>
            {state && context ? (
              <PostPurchaseFormOnceOff resultingDenom={resultingDenom} />
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
    <ControlDeskStrategyInfoProvider strategyInfo={{
      strategyType: ControlDeskStrategyTypes.OnceOffPayment,
      transactionType: TransactionType.Sell,
      formName: ControlDeskFormNames.OnceOffPayment,
    }}>
      <Page />
    </ControlDeskStrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
