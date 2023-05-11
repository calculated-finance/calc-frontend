import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { FormNames } from 'src/hooks/useFormStore';
import { useCreateVaultWeightedScale } from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { useWeightedScaleConfirmForm } from '@hooks/useWeightedScaleForm';
import { FormikHelpers } from 'formik';
import { SummaryTheSwapWeightedScale } from '@components/Summary/SummaryTheSwapWeightedScale';
import FeesWeightedScale from '@components/FeesWeightedScale';
import { StrategyTypes } from '@models/StrategyTypes';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { WeightSummary } from '@components/WeightSummary';
import { StepConfig } from '@formConfig/StepConfig';

export function WeightedScaleConfirmPage({
  formName,
  steps,
  transactionType,
  strategyType,
}: {
  formName: FormNames;
  steps: StepConfig[];
  transactionType: TransactionType;
  strategyType: StrategyTypes;
}) {
  const { state, actions } = useWeightedScaleConfirmForm(formName);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(steps);

  const { mutate, isError, error, isLoading } = useCreateVaultWeightedScale(formName, transactionType);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
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
    });

  const handleRestart = () => {
    actions.resetAction();
    goToStep(0);
  };

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
        Confirm &amp; Sign
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={strategyType} />
            <SummaryTheSwapWeightedScale state={state} />
            <SummaryWhileSwapping
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              priceThresholdValue={undefined}
              slippageTolerance={state.slippageTolerance}
            />
            <WeightSummary
              transactionType={transactionType}
              applyMultiplier={state.applyMultiplier}
              swapMultiplier={state.swapMultiplier}
              swapAmount={state.swapAmount}
              basePrice={state.basePriceValue}
            />
            <SummaryAfterEachSwap state={state} />

            <FeesWeightedScale formName={formName} transactionType={transactionType} />
            <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
          </Stack>
        ) : (
          <InvalidData onRestart={handleRestart} />
        )}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

function Page() {
  return (
    <WeightedScaleConfirmPage
      formName={FormNames.WeightedScaleIn}
      steps={weightedScaleInSteps}
      transactionType={TransactionType.Buy}
      strategyType={StrategyTypes.WeightedScaleIn}
    />
  );
}
Page.getLayout = getFlowLayout;

export default Page;
