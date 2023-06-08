import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { FormNames } from 'src/hooks/useFormStore';
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
import getDenomInfo from '@utils/getDenomInfo';

function Page() {
  const { state, actions } = useDcaPlusConfirmForm(FormNames.DcaPlusIn);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(dcaPlusInSteps);
  const { price } = useFiatPrice(state && getDenomInfo(state.initialDenom));

  const { mutate, isError, error, isLoading } = useCreateVaultDcaPlus(FormNames.DcaPlusIn, TransactionType.Buy);

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

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={dcaPlusInSteps} resetForm={actions.resetAction} />
      <NewStrategyModalBody stepsConfig={dcaPlusInSteps} isLoading={isPageLoading || !price} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={getDenomInfo(state.initialDenom)}
              resultingDenom={getDenomInfo(state.resultingDenom)}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAPlusIn} />
            <SummaryTheSwapDcaPlus
              initialDenom={getDenomInfo(state.initialDenom)}
              resultingDenom={getDenomInfo(state.resultingDenom)}
              initialDeposit={state.initialDeposit}
              strategyDuration={state.strategyDuration}
            />
            <SummaryWhileSwapping
              transactionType={transactionType}
              initialDenom={getDenomInfo(state.initialDenom)}
              resultingDenom={getDenomInfo(state.resultingDenom)}
              priceThresholdValue={undefined}
              slippageTolerance={state.slippageTolerance}
            />
            <SummaryAfterEachSwap state={state} />
            <SummaryBenchmark state={state} />
            <FeesDcaPlus formName={FormNames.DcaPlusIn} transactionType={TransactionType.Buy} />
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
