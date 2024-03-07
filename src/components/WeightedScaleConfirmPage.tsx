import { Divider, Stack } from '@chakra-ui/react';
import { useCreateVaultWeightedScale } from '@hooks/useCreateVault/useCreateVaultWeightedScale';
import useSteps from '@hooks/useSteps';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { useWeightedScaleConfirmForm } from '@hooks/useWeightedScaleForm';
import { FormikHelpers } from 'formik';
import { SummaryTheSwapWeightedScale } from '@components/Summary/SummaryTheSwapWeightedScale';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { WeightSummary } from '@components/WeightSummary';
import { StepConfig } from '@formConfig/StepConfig';
import { SWAP_FEE_WS } from 'src/constants';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import useStrategy from '@hooks/useStrategy';
import useSpotPrice from '@hooks/useSpotPrice';
import Fees from './Fees';
import { InvalidData } from './InvalidData';
import { ModalWrapper } from './ModalWrapper';
import { SigningState } from './NewStrategyModal';

function PageInternal({
  state,
  isError,
  error,
  handleSubmit,
}: {
  state: WeightedScaleState;
  isError: boolean;
  error: Error | null;
  handleSubmit: (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) => void;
}) {
  const { transactionType } = useStrategyInfo();
  const { initialDenom, resultingDenom } = state;
  if (!initialDenom || !resultingDenom) return null;

  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
      <Divider />
      <SummaryYourDeposit state={state} />
      <SummaryTheSwapWeightedScale state={state} />
      <WeightSummary
        transactionType={transactionType}
        applyMultiplier={state.applyMultiplier}
        swapMultiplier={state.swapMultiplier}
        swapAmount={state.swapAmount}
        basePrice={state.basePriceValue}
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        route={state.route}
        priceThresholdValue={state.priceThresholdValue}
      />
      <SummaryWhileSwapping
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        priceThresholdValue={state.priceThresholdValue}
        slippageTolerance={state.slippageTolerance}
      />
      <SummaryAfterEachSwap state={state} />
      <Fees
        initialDenom={initialDenom}
        autoStakeValidator={state.autoStakeValidator}
        swapAmount={state.swapAmount}
        swapFee={SWAP_FEE_WS}
        swapFeeTooltip="Calculated assuming base swap. Actual fees per swap depend on the resulting swap amount."
        excludeDepositFee
      />
      <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
    </Stack>
  );
}

export function WeightedScaleConfirmPage({ steps }: { steps: StepConfig[] }) {
  const { state, actions } = useWeightedScaleConfirmForm();
  const { nextStep, goToStep } = useSteps(steps);

  const initialDenom = state?.initialDenom;
  const resultingDenom = state?.resultingDenom;

  const { mutate, isError, error, isLoading } = useCreateVaultWeightedScale(initialDenom);

  const { transactionType } = useStrategyInfo();

  const { spotPrice: dexPrice } = useSpotPrice(resultingDenom, initialDenom, transactionType, undefined, !!state);

  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { state, dexPrice, reinvestStrategyData },
      {
        onSuccess: async (strategyId) => {
          nextStep({
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

  return (
    <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
      {state ? (
        <SigningState isSigning={isLoading}>
          <PageInternal state={state} isError={isError} error={error} handleSubmit={handleSubmit} />
        </SigningState>
      ) : (
        <InvalidData onRestart={handleRestart} />
      )}
    </ModalWrapper>
  );
}
