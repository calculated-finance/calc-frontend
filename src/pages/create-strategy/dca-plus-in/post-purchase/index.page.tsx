import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { useDcaPlusInFormPostPurchase } from '@hooks/useDcaPlusForm';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { InvalidData } from '@components/InvalidData';
import { DcaPlusPostPurchaseFormSchema } from '@models/dcaPlusFormData';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { actions, state, context } = useDcaPlusInFormPostPurchase(FormNames.DcaPlusIn);
  const steps = dcaPlusInSteps;

  const { nextStep, goToStep } = useSteps(steps);
  const { validate } = useValidation(DcaPlusPostPurchaseFormSchema, { context });

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
    <ModalWrapper stepsConfig={dcaPlusInSteps} reset={resetForm(FormNames.DcaPlusIn)}>
      <Page />
    </ModalWrapper>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
