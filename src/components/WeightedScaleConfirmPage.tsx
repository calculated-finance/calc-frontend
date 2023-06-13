import { Divider, Stack } from '@chakra-ui/react';
import { FormNames } from 'src/hooks/useFormStore';
import { useCreateVaultWeightedScale } from '@hooks/useCreateVault';
import useSteps from '@hooks/useSteps';
import { TransactionType } from '@components/TransactionType';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { useWeightedScaleConfirmForm } from '@hooks/useWeightedScaleForm';
import { FormikHelpers } from 'formik';
import { SummaryTheSwapWeightedScale } from '@components/Summary/SummaryTheSwapWeightedScale';
import { StrategyTypes } from '@models/StrategyTypes';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { WeightSummary } from '@components/WeightSummary';
import { StepConfig } from '@formConfig/StepConfig';
import { SWAP_FEE_WS } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';
import { WeightedScaleState } from '@models/weightedScaleFormData';
import Fees from './Fees';
import { InvalidData } from './InvalidData';
import { ModalWrapper } from './ModalWrapper';
import { SigningState } from './NewStrategyModal';

function PageInternal({
  state,
  strategyType,
  transactionType,
  isError,
  error,
  handleSubmit,
}: {
  state: WeightedScaleState;
  strategyType: StrategyTypes;
  transactionType: TransactionType;
  isError: boolean;
  error: Error | null;
  handleSubmit: (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) => void;
}) {
  const initialDenom = getDenomInfo(state.initialDenom);
  const resultingDenom = getDenomInfo(state.resultingDenom);
  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
      <Divider />
      <SummaryYourDeposit state={state} strategyType={strategyType} />
      <SummaryTheSwapWeightedScale state={state} transactionType={transactionType} />
      <WeightSummary
        transactionType={transactionType}
        applyMultiplier={state.applyMultiplier}
        swapMultiplier={state.swapMultiplier}
        swapAmount={state.swapAmount}
        basePrice={state.basePriceValue}
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        priceThresholdValue={state.priceThresholdValue}
      />
      <SummaryWhileSwapping
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        priceThresholdValue={state.priceThresholdValue}
        slippageTolerance={state.slippageTolerance}
        transactionType={transactionType}
      />
      <SummaryAfterEachSwap state={state} />
      <Fees
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        autoStakeValidator={state.autoStakeValidator}
        swapAmount={state.swapAmount}
        transactionType={transactionType}
        swapFee={SWAP_FEE_WS}
        swapFeeTooltip="Calcuated assuming base swap. Actual fees per swap depend on the resulting swap amount."
        excludeDepositFee
      />
      <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
    </Stack>
  );
}

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
  const { nextStep, goToStep } = useSteps(steps);

  const { price } = useFiatPrice(state && getDenomInfo(state.initialDenom));

  const { mutate, isError, error, isLoading } = useCreateVaultWeightedScale(formName, transactionType);

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

  return (
    <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
      {state ? (
        <SigningState isSigning={isLoading}>
          <PageInternal
            transactionType={transactionType}
            strategyType={strategyType}
            state={state}
            isError={isError}
            error={error}
            handleSubmit={handleSubmit}
          />
        </SigningState>
      ) : (
        <InvalidData onRestart={handleRestart} />
      )}
    </ModalWrapper>
  );
}
