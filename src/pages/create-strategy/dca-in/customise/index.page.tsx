import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import useSteps from '@hooks/useSteps';
import { Formik } from 'formik';
import { useStep2Form } from 'src/hooks/useDcaInForm';
import useValidation from '@hooks/useValidation';
import { StrategyTypes } from '@models/StrategyTypes';
import { DcaInFormDataStep2, step2ValidationSchema } from '@models/DcaInFormData';
import dcaInSteps from 'src/formConfig/dcaIn';
import { InvalidData } from '@components/InvalidData';
import { FormNames } from '@hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { CustomiseFormDca } from '../../../../components/Forms/CustomiseForm/CustomiseFormDca';

function DcaInStep2() {
  const { actions, state } = useStep2Form(FormNames.DcaIn);

  const { validate } = useValidation(step2ValidationSchema, { ...state?.step1, strategyType: StrategyTypes.DCAIn });
  const { nextStep, goToStep } = useSteps(dcaInSteps);

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  if (!state) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={dcaInSteps} resetForm={actions.resetAction} />
        <NewStrategyModalBody stepsConfig={dcaInSteps} isLoading={false}>
          <InvalidData onRestart={handleRestart} />
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = state.step2;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      <CustomiseFormDca
        steps={dcaInSteps}
        resetAction={actions.resetAction}
        step1={state.step1}
        transactionType={TransactionType.Buy}
      />
    </Formik>
  );
}

DcaInStep2.getLayout = getFlowLayout;

export default DcaInStep2;
