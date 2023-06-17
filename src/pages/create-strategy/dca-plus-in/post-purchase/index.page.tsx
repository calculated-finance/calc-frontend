import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase } from 'src/models/DcaInFormData';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import { Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { useDcaPlusInFormPostPurchase } from '@hooks/useDcaPlusForm';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { InvalidData } from '@components/InvalidData';
import { DcaPlusPostPurchaseFormSchema } from '@models/dcaPlusFormData';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { actions, state, context } = useDcaPlusInFormPostPurchase();
  const steps = dcaPlusInSteps;

  const { nextStep, goToStep } = useSteps(steps);
  const { validate } = useValidation(DcaPlusPostPurchaseFormSchema, { context });

  const onSubmit = async (formData: DcaInFormDataPostPurchase) => {
    await actions.updateAction(formData);
    await nextStep();
  };



  const resultingDenom = useDenom(context?.resultingDenom);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {state && context ? (
        <PostPurchaseForm resultingDenom={resultingDenom} />
      ) : (
        <InvalidData/>
      )}
    </Formik>
  );
}

function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
        <StrategyInfoProvider strategyInfo={{
      strategyType: StrategyTypes.DCAPlusIn,
      transactionType: TransactionType.Buy,
      formName: FormNames.DcaPlusIn,
    }}>

   
    <ModalWrapper stepsConfig={dcaPlusInSteps} reset={resetForm(FormNames.DcaPlusIn)}>
      <Page />
    </ModalWrapper>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
