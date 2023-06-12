import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import { useCreateVaultDca } from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryTheSwap } from '@components/Summary/SummaryTheSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { FormikHelpers } from 'formik';
import { StrategyTypes } from '@models/StrategyTypes';
import Fees from '@components/Fees';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { FormNames } from '@hooks/useFormStore';
import { SWAP_FEE } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';
import { useDenom } from '@hooks/useDenom/useDenom';

function Page() {
  const { state, actions } = useConfirmForm(FormNames.DcaIn);
  const { isPageLoading } = usePageLoad();
  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = useDenom(state?.resultingDenom);
  const { price } = useFiatPrice(initialDenom);
  const { nextStep, goToStep } = useSteps(steps);

  const { mutate, isError, error, isLoading } = useCreateVaultDca(FormNames.DcaIn, TransactionType.Buy);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { price },
      {
        onSuccess: async (strategyId) => {
          await nextStep({
            strategyId,
            timeSaved: state && getTimeSaved(state.initialDeposit, state.swapAmount),
          });
          actions.resetAction();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  const transactionType = TransactionType.Buy;

  if (!state) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction} cancelUrl="/create-strategy" />
        <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading || !price} isSigning={isLoading}>
          <InvalidData onRestart={handleRestart} />
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction} cancelUrl="/create-strategy" />
      <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading || !price} isSigning={isLoading}>
        <Stack spacing={4}>
          <DcaDiagram
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
            initialDeposit={state.initialDeposit}
          />
          <Divider />
          <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAIn} />
          <SummaryTheSwap state={state} transactionType={transactionType} />
          <SummaryWhileSwapping
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
            priceThresholdValue={state.priceThresholdValue}
            slippageTolerance={state.slippageTolerance}
            transactionType={transactionType}
          />
          <SummaryAfterEachSwap state={state} />
          <Fees
            transactionType={TransactionType.Buy}
            swapFee={SWAP_FEE}
            initialDenom={initialDenom}
            resultingDenom={resultingDenom}
            autoStakeValidator={state.autoStakeValidator}
            swapAmount={state.swapAmount}
          />
          <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
