import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase, postPurchaseValidationSchema } from 'src/models/DcaInFormData';
import { useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import { Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { InvalidData } from '@components/InvalidData';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { actions, state, context } = useDcaInFormPostPurchase(FormNames.DcaIn);
  const { nextStep, goToStep } = useSteps(steps);
  const { validate } = useValidation(postPurchaseValidationSchema, { context });

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
    <ModalWrapper stepsConfig={steps} reset={resetForm(FormNames.DcaIn)}>
      <Page />
    </ModalWrapper>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
