import { Button, Divider, Stack } from '@chakra-ui/react';
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
import { SummaryYourDepositControlDesk } from 'src/pages/control-desk/Components/Summary/SummaryYourDepositControlDesk';
import Fees from '@components/Fees';
import { SummaryTheSwapControlDesk } from 'src/pages/control-desk/Components/Summary/SummaryTheSwapControlDesk';
import { SummaryAfterEachSwapControlDesk } from 'src/pages/control-desk/Components/Summary/SummaryAfterEachSwapControlDesk';
import { SWAP_FEE } from 'src/constants';
import { SummaryWhileSwappingControlDesk } from 'src/pages/control-desk/Components/Summary/SummaryWhileSwappingControlDesk';

function Page() {
  const { state, actions } = useConfirmFormControlDesk();
  const { nextStep, goToStep } = useSteps(onceOffSteps);

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = getDenomInfo(state?.resultingDenom);

  console.log(state);

  // const { mutate, isError, error, isLoading } = useCreateVaultOnceOff(initialDenom);

  // const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
  //   mutate(
  //     { state },
  //     {
  //       onSuccess: async (strategyId) => {
  //         await nextStep({
  //           strategyId,
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
    <SigningState isSigning={Boolean(false)}>
      {/* <SigningState isSigning={isLoading}> */}
      <Stack spacing={4}>
        <OnceOffDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} targetAmount={state.targetAmount} />
        <Divider />
        <SummaryYourDepositControlDesk state={state} />
        <SummaryTheSwapControlDesk state={state} transactionType={transactionType} />
        {/* <InvalidData /> */}
        <SummaryWhileSwappingControlDesk
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          priceThresholdValue={state.priceThresholdValue}
          slippageTolerance={state.slippageTolerance}
        />
        <SummaryAfterEachSwapControlDesk state={state} />
        <Fees
          swapFee={SWAP_FEE}
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          autoStakeValidator={undefined}
          swapAmount={23}
          transactionType={transactionType}
          // swapAmount={state.swapAmount} need to update this.
        />

        {/* <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} /> */}
        {/* FAKE BUTTON MUST REMOVE  */}
        <Button type="submit" data-testid="submit-button" w="full">
          Confirm
        </Button>
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
