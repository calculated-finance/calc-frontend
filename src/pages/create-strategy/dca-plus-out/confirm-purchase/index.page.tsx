import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useCreateVaultDcaPlus } from '@hooks/useCreateVault';
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
import { FormNames, useFormStore } from '@hooks/useFormStore';
import useFiatPrice from '@hooks/useFiatPrice';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { state, actions } = useDcaPlusConfirmForm(FormNames.DcaPlusOut);
  const { nextStep, goToStep } = useSteps(dcaPlusOutSteps);
  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = useDenom(state?.resultingDenom);
  const { price } = useFiatPrice(initialDenom);

  const { mutate, isError, error } = useCreateVaultDcaPlus(FormNames.DcaPlusOut, TransactionType.Sell);

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
    return <InvalidData onRestart={handleRestart} />;
  }

  const transactionType = TransactionType.Sell;

  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
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
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        strategyDuration={state.strategyDuration}
        initialDeposit={state.initialDeposit}
        autoStakeValidator={state.autoStakeValidator}
      />
      <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
    </Stack>
  );
}
function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={dcaPlusOutSteps} reset={resetForm(FormNames.DcaPlusOut)}>
      <Page />
    </ModalWrapper>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
