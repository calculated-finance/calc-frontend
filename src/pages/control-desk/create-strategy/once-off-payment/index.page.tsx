import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo from '@utils/getDenomInfo';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import dcaOutSteps from '@formConfig/dcaOut';
import { OverCollateralisedDeposit } from '../../OverCollateralisedDeposit';
import InputAsset from '../../InputAsset';
import OutputAsset from '../../OutputAsset';
import { ControlDeskStrategyTypes } from '../../ControlDeskStrategyTypes';
import { ControlDeskFormNames, ControlDeskStrategyInfoProvider } from '../../useControlDeskStrategyInfo';

function OnceOffPayment() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(dcaOutSteps);
  const { data: balances } = useBalances();

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
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper reset={actions.resetAction} stepsConfig={steps}>
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <InputAsset />
              <OutputAsset
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              <OverCollateralisedDeposit />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

function Page() {
  return (
    <ControlDeskStrategyInfoProvider
      strategyInfo={{
        strategyType: ControlDeskStrategyTypes.OnceOffPayment,
        transactionType: TransactionType.Sell,
        formName: ControlDeskFormNames.OnceOffPayment,
      }}
    >
      <OnceOffPayment />
    </ControlDeskStrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
