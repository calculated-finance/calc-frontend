import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import useSteps from '@hooks/useSteps';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import getDenomInfo from '@utils/getDenomInfo';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import { ControlDeskStrategyInfoProvider } from 'src/pages/control-desk/useControlDeskStrategyInfo';
import { ControlDeskStrategyTypes } from 'src/pages/control-desk/Components/ControlDeskStrategyTypes';
import { ControlDeskFormNames, useControlDeskFormStore } from 'src/pages/control-desk/useControlDeskFormStore';
import onceOffSteps from 'src/pages/control-desk/onceOffForm';
import { useConfirmFormControlDesk } from 'src/pages/control-desk/useOnceOffForm';
import { SigningState } from '@components/NewStrategyModal';
import OnceOffDiagram from 'src/pages/control-desk/Components/OnceOffDiagram';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { FormikHelpers } from 'formik';
import { useCreateVaultOnceOff } from '../../useCreateVaultOnceOff';

function Page() {
  const { state, actions } = useConfirmFormControlDesk();
  const { nextStep, goToStep } = useSteps(onceOffSteps);



  console.log('confirm state', state)

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = getDenomInfo(state?.resultingDenom);

  const { mutate, isError, error, isLoading } = useCreateVaultOnceOff(initialDenom);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) => { }
  // mutate(
  //   { state},
  //   {
  //     onSuccess: async (strategyId) => {
  //       await nextStep({
  //         strategyId,
  //         timeSaved: state && getTimeSaved(state.initialDeposit, 2),
  //       });
  //       actions.resetAction();
  //     },
  //     onSettled: () => {
  //       setSubmitting(false);
  //   },
  // },
  // );

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const transactionType = TransactionType.Sell;

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

  return (
    <SigningState isSigning={isLoading}>
      <Stack spacing={4}>
        <OnceOffDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} targetAmount={state.targetAmount} />
        <Divider />
        {/* <SummaryYourDeposit state={state} /> */}
        {/* <SummaryTheSwap state={state} transactionType={transactionType} /> */}
        {/* <SummaryWhileSwapping
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          priceThresholdValue={state.priceThresholdValue}
          slippageTolerance={state.slippageTolerance}
        /> */}
        {/* <SummaryAfterEachSwap state={state} />  */}
        {/* <Fees
          swapFee={SWAP_FEE}
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          autoStakeValidator={state.autoStakeValidator}
          swapAmount={state.swapAmount}
        /> */}
        <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
      </Stack>
    </SigningState>
  );
}
function PageWrapper() {
  const { resetForm } = useControlDeskFormStore();

  return (
    <ControlDeskStrategyInfoProvider
      strategyInfo={{
        strategyType: ControlDeskStrategyTypes.OnceOffPayment,
        transactionType: TransactionType.Sell,
        formName: ControlDeskFormNames.OnceOffPayment,
      }}
    >
      <ModalWrapper stepsConfig={onceOffSteps} reset={resetForm(ControlDeskFormNames.OnceOffPayment)}>
        <Page />
      </ModalWrapper>
    </ControlDeskStrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
