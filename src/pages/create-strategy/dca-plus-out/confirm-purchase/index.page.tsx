import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { useCreateVaultDcaPlus } from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { FormikHelpers } from 'formik';
import { SummaryTheSwapDcaPlus } from '@components/Summary/SummaryTheSwapDcaPlus';
import { SummaryBenchmark } from '@components/Summary/SummaryBenchmark';
import FeesDcaPlus from '@components/FeesDcaPlus';
import { StrategyTypes } from '@models/StrategyTypes';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { getTimeSaved } from '@helpers/getTimeSaved';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import { FormNames } from '@hooks/useFormStore';
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';

function Page() {
  const { state, actions } = useDcaPlusConfirmForm(FormNames.DcaPlusOut);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(dcaPlusOutSteps);
  const { price } = useFiatPrice(state && getDenomInfo(state.initialDenom));

  const { mutate, isError, error, isLoading } = useCreateVaultDcaPlus(FormNames.DcaPlusOut, TransactionType.Sell);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { price },
      {
        onSuccess: async (strategyId) => {
          await nextStep({
            strategyId,
            timeSaved:
              state &&
              getTimeSaved(
                state.initialDeposit,
                getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration),
              ),
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

  if (!state) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={dcaPlusOutSteps} resetForm={actions.resetAction} />
        <NewStrategyModalBody stepsConfig={dcaPlusOutSteps} isLoading isSigning={isLoading}>
          Loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const initialDenom = getDenomInfo(state.initialDenom);
  const resultingDenom = getDenomInfo(state.resultingDenom);

  const transactionType = TransactionType.Sell;
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={dcaPlusOutSteps} resetForm={actions.resetAction} />
      <NewStrategyModalBody stepsConfig={dcaPlusOutSteps} isLoading={isPageLoading || !price} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAPlusOut} />
            <SummaryTheSwapDcaPlus
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
              strategyDuration={state.strategyDuration}
              initialDeposit={state.initialDeposit}
            />
            <SummaryWhileSwapping
              transactionType={transactionType}
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
              priceThresholdValue={undefined}
              slippageTolerance={state.slippageTolerance}
            />
            <SummaryAfterEachSwap state={state} />
            <SummaryBenchmark state={state} />
            <FeesDcaPlus
              transactionType={TransactionType.Sell}
              initialDenom={getDenomInfo(state.initialDenom)}
              resultingDenom={getDenomInfo(state.resultingDenom)}
              strategyDuration={state.strategyDuration}
              initialDeposit={state.initialDeposit}
              autoStakeValidator={state.autoStakeValidator}
            />
            <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
          </Stack>
        ) : (
          <InvalidData onRestart={handleRestart} />
        )}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Page.getLayout = getFlowLayout;

export default Page;
