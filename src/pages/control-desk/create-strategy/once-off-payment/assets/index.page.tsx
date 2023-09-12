import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik, useField } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo from '@utils/getDenomInfo';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { ControlDeskFormDataStep1, step1ValidationSchemaControlDesk } from 'src/pages/control-desk/Components/ControlDeskForms';
import InputAsset from 'src/pages/control-desk/Components/InputAsset';
import OutputAsset from 'src/pages/control-desk/Components/OutputAsset';
import { OverCollateralisedDeposit } from 'src/pages/control-desk/Components/OverCollateralisedDeposit';
import usePageLoad from '@hooks/usePageLoad';
import { ControlDeskStrategyTypes } from 'src/pages/control-desk/Components/ControlDeskStrategyTypes';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { RecipientArrayFormValues } from 'src/pages/control-desk/Components/AddRecipientButton';
import { useForm } from 'react-hook-form';
import { ControlDeskStrategyInfoProvider } from '../../../useControlDeskStrategyInfo';
import { ControlDeskFormNames } from '../../../useControlDeskFormStore';
import useControlDeskForm from '../../../useOnceOffForm';
import onceOffSteps from '../../../onceOffForm';

function OnceOffPayment() {
  const { connected } = useWallet();
  const { actions, state } = useControlDeskForm();
  const { isPageLoading } = usePageLoad();

  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(onceOffSteps);
  const { data: balances } = useBalances();


  const { validate } = useValidation(step1ValidationSchemaControlDesk, { balances });

  const onSubmit = async (formData: ControlDeskFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={onceOffSteps} reset={actions.resetAction}>
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
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader
            stepsConfig={onceOffSteps}
            resetForm={actions.resetAction}
            cancelUrl="/control-desk/create-strategy"
            data-testid="strategy-modal-header"
          />
          <NewStrategyModalBody stepsConfig={onceOffSteps} isLoading={isPageLoading && !isSubmitting}>
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
          </NewStrategyModalBody>
        </NewStrategyModal>)}
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
