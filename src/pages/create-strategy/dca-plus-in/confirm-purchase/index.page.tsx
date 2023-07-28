import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { SigningState } from '@components/NewStrategyModal';
import { FormNames, useFormStore } from 'src/hooks/useFormStore';
import { useCreateVaultDcaPlus } from '@hooks/useCreateVault/useCreateVaultDcaPlus';
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
import { useDenom } from '@hooks/useDenom/useDenom';
import React, { Suspense } from 'react';
import useStrategy from '@hooks/useStrategy';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

const ModalWrapper = React.lazy(() =>
  import('@components/ModalWrapper').then((module) => ({ default: module.ModalWrapper })),
);

function Page() {
  const { state, actions } = useDcaPlusConfirmForm();
  const { nextStep, goToStep } = useSteps(dcaPlusInSteps);

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = useDenom(state?.resultingDenom);

  const { mutate, isError, error, isLoading } = useCreateVaultDcaPlus(initialDenom);
  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy);

  const handleSubmit = (_: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { state, reinvestStrategyData },
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

  return (
    <SigningState isSigning={isLoading}>
      <Stack spacing={4}>
        <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
        <Divider />
        <SummaryYourDeposit state={state} />
        <SummaryTheSwapDcaPlus
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          initialDeposit={state.initialDeposit}
          strategyDuration={state.strategyDuration}
        />
        <SummaryWhileSwapping
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          priceThresholdValue={undefined}
          slippageTolerance={state.slippageTolerance}
        />
        <SummaryAfterEachSwap state={state} />
        <SummaryBenchmark state={state} />
        <FeesDcaPlus
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          strategyDuration={state.strategyDuration}
          initialDeposit={state.initialDeposit}
          autoStakeValidator={state.autoStakeValidator}
        />
        <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
      </Stack>
    </SigningState>
  );
}

function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAPlusIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaPlusIn,
      }}
    >
      <Suspense>
        <ModalWrapper stepsConfig={dcaPlusInSteps} reset={resetForm(FormNames.DcaPlusIn)}>
          <Page />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
