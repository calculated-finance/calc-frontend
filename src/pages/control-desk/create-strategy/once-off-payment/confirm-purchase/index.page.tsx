import { Flex } from '@chakra-ui/react';
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
import { useCreateVaultOnceOff } from '../../useCreateVaultOnceOff';

function Page() {
  const { state, actions } = useConfirmFormControlDesk();
  const { nextStep, goToStep } = useSteps(onceOffSteps);

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = getDenomInfo(state?.resultingDenom);

  const { mutate, isError, error, isLoading } = useCreateVaultOnceOff(initialDenom);

  // const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
  //   mutate(
  //     { state, reinvestStrategyData },
  //     {
  //       onSuccess: async (strategyId) => {
  //         await nextStep({
  //           strategyId,
  //           timeSaved: state && getTimeSaved(state.initialDeposit, state.swapAmount),
  //         });
  //         actions.resetAction();
  //       },
  //       onSettled: () => {
  //         setSubmitting(false);
  //       },
  //     },
  //   );

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const transactionType = TransactionType.Sell;

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

  return (
    // <SigningState isSigning={isLoading}>
    //   <Stack spacing={4}>
    //     <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
    //     <Divider />
    //     <SummaryYourDeposit state={state} />
    //     <SummaryTheSwap state={state} transactionType={transactionType} />
    //     <SummaryWhileSwapping
    //       initialDenom={initialDenom}
    //       resultingDenom={resultingDenom}
    //       priceThresholdValue={state.priceThresholdValue}
    //       slippageTolerance={state.slippageTolerance}
    //     />
    //     <SummaryAfterEachSwap state={state} />
    //     <Fees
    //       swapFee={SWAP_FEE}
    //       initialDenom={initialDenom}
    //       resultingDenom={resultingDenom}
    //       autoStakeValidator={state.autoStakeValidator}
    //       swapAmount={state.swapAmount}
    //     />
    //     <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
    //   </Stack>
    // </SigningState>
    <Flex>Hi</Flex>
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
