import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { InvalidData } from '@components/InvalidData';
import { WeightedScalePostPurchaseFormSchema } from '@models/weightedScaleFormData';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { PostPurchaseForm } from '@components/PostPurchaseForm';
import { FormNames } from '@hooks/useFormStore';

function Page() {
  const { actions, state, context } = useDcaInFormPostPurchase(FormNames.WeightedScaleOut);
  const steps = weightedScaleOutSteps;
  const { nextStep, goToStep } = useSteps(steps);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(WeightedScalePostPurchaseFormSchema);

  const onSubmit = async (formData: DcaInFormDataPostPurchase) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={weightedScaleOutSteps} resetForm={actions.resetAction} />
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            {state ? (
              <PostPurchaseForm resultingDenom={context?.resultingDenom} />
            ) : (
              <InvalidData onRestart={handleRestart} />
            )}
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
