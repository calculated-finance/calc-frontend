import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import { Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { useWeightedScaleInFormPostPurchase } from '@hooks/useWeightedScaleForm';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { InvalidData } from '@components/InvalidData';
import { WeightedScalePostPurchaseFormSchema } from '@models/weightedScaleFormData';
import getDenomInfo from '@utils/getDenomInfo';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { actions, state, context } = useWeightedScaleInFormPostPurchase(FormNames.WeightedScaleIn);
  const steps = weightedScaleInSteps;

  const { nextStep, goToStep } = useSteps(steps);
  const { validate } = useValidation(WeightedScalePostPurchaseFormSchema, { context });

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
      {state && context ? (
        <PostPurchaseForm resultingDenom={getDenomInfo(context.resultingDenom)} />
      ) : (
        <InvalidData onRestart={handleRestart} />
      )}
    </Formik>
  );
}

function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={weightedScaleInSteps} reset={resetForm(FormNames.WeightedScaleIn)}>
      <Page />
    </ModalWrapper>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
