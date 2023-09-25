import { Center, Stack } from '@chakra-ui/react';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import steps from '@formConfig/dcaIn';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import NewStrategyModal, { NewStrategyModalBody } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import { ExecutionIntervalLegacy } from '@components/ExecutionInterval';
import { SwapAmountLegacy } from '@components/SwapAmount';
import DCAInInitialDenomSimplified from '@components/DCAinInitialDenomSimplified';
import DCAInResultingDenomSimplified from '@components/DCAInResultingDenomSimplified';
import { SimpleDcaModalHeader } from './SimpleDcaModalHeader';

function DcaIn() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(steps);
  const { data: balances } = useBalances();
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(step1ValidationSchema, { balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }

  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom,
    resultingDenom: state.step1.resultingDenom,
    initialDeposit: state.step1.initialDeposit,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <NewStrategyModal>
          <SimpleDcaModalHeader />
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={6}>
                <DCAInInitialDenomSimplified />
                <DCAInResultingDenomSimplified
                  denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
                />
                <ExecutionIntervalLegacy />
                <SwapAmountLegacy
                  isEdit={Boolean(false)}
                  initialDenomString={initialValues.initialDenom}
                  resultingDenomString={initialValues.resultingDenom}
                  initialDeposit={12}
                  transactionType={TransactionType.Buy}
                />
                {connected ? <Submit>Confirm</Submit> : <StepOneConnectWallet />}
              </Stack>
            </Form>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

function SimpleDca() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <DcaIn />
    </StrategyInfoProvider>
  );
}

export default SimpleDca;
