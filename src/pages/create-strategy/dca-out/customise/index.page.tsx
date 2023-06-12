import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import useSteps from '@hooks/useSteps';
import { Formik } from 'formik';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import { InvalidData } from '@components/InvalidData';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames } from '@hooks/useFormStore';
import { CustomiseFormDca } from '@components/Forms/CustomiseForm/CustomiseFormDca';

function Page() {
  const { actions, state } = useStep2Form(FormNames.DcaOut);

  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType: StrategyTypes.DCAOut });
  const { nextStep, goToStep } = useSteps(dcaOutSteps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    // TODO: clean this up so we dont need two modal codes
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader
          stepsConfig={dcaOutSteps}
          resetForm={actions.resetAction}
          cancelUrl="/create-strategy"
        />
        <NewStrategyModalBody stepsConfig={dcaOutSteps} isLoading={false}>
          <InvalidData onRestart={handleRestart} />
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }
  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = state?.step2;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      <CustomiseFormDca
        steps={dcaOutSteps}
        resetAction={actions.resetAction}
        step1={state.step1}
        transactionType={TransactionType.Sell}
      />
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
