import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
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
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { FormikHelpers } from 'formik';
import { SummaryTheSwapDcaPlus } from '@components/Summary/SummaryTheSwapDcaPlus';
import { SummaryBenchmark } from '@components/Summary/SummaryBenchmark';
import FeesDcaPlus from '@components/FeesDcaPlus';
import { StrategyTypes } from '@models/StrategyTypes';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { getTimeSaved } from '@helpers/getTimeSaved';
import useFiatPrice from '@hooks/useFiatPrice';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { state, actions } = useDcaPlusConfirmForm(FormNames.DcaPlusIn);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(dcaPlusInSteps);

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = useDenom(state?.resultingDenom);

  const { price } = useFiatPrice(initialDenom);

  const { mutate, isError, error } = useCreateVaultDcaPlus(FormNames.DcaPlusIn, TransactionType.Buy);

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

  const transactionType = TransactionType.Buy;

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
      <Divider />
      <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAPlusIn} />
      <SummaryTheSwapDcaPlus
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        initialDeposit={state.initialDeposit}
        strategyDuration={state.strategyDuration}
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
        transactionType={TransactionType.Buy}
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
    <ModalWrapper stepsConfig={dcaPlusInSteps} reset={resetForm(FormNames.DcaPlusIn)}>
      <Page />
    </ModalWrapper>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
