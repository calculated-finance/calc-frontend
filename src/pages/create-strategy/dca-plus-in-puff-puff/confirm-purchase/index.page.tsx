import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { FormNames } from 'src/hooks/useDcaInForm';
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
import { getSwapAmountFromDuration } from 'src/helpers/getSwapAmountFromDuration';
import { getTimeSaved } from 'src/helpers/getTimeSaved';

function Page() {
  const { state, actions } = useDcaPlusConfirmForm(FormNames.DcaPlusIn);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(dcaPlusInSteps);

  const { mutate, isError, error, isLoading } = useCreateVaultDcaPlus(FormNames.DcaPlusIn, TransactionType.Buy);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
      onSuccess: async (strategyId) => {
        await nextStep({
          strategyId,
          timeSaved:
            state &&
            getTimeSaved(state.initialDeposit, getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration)),
        });
        actions.resetAction();
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={dcaPlusInSteps} resetForm={actions.resetAction}>
        Confirm &amp; Sign
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={dcaPlusInSteps} isLoading={isPageLoading} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAPlus} />
            <SummaryTheSwapDcaPlus state={state} />
            <SummaryWhileSwapping state={state} />
            <SummaryAfterEachSwap state={state} />
            <SummaryBenchmark state={state} />
            <FeesDcaPlus formName={FormNames.DcaIn} />
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
