import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useDcaInConfirmForm } from 'src/hooks/useDcaInForm';
import { useCreateVaultDca } from '@hooks/useCreateVault/useCreateVaultDca';
import useSteps from '@hooks/useSteps';
import dcaInSteps from 'src/formConfig/dcaIn';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryTheSwap } from '@components/Summary/SummaryTheSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { FormikHelpers } from 'formik';
import { StrategyType } from '@models/StrategyType';
import Fees from '@components/Fees';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { SWAP_FEE } from 'src/constants';
import { ModalWrapper } from '@components/ModalWrapper';
import { SigningState } from '@components/NewStrategyModal';
import useStrategy from '@hooks/useStrategy';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';

function Page() {
  const { state, actions } = useDcaInConfirmForm();
  const { nextStep, goToStep } = useSteps(dcaInSteps);

  const { mutate, isError, error, isLoading } = useCreateVaultDca();
  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy);

  const handleSubmit = (_: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { state, reinvestStrategyData },
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

  const transactionType = TransactionType.Buy;

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

  const { initialDenom, resultingDenom } = state;

  return (
    <SigningState isSigning={isLoading}>
      <Stack spacing={4}>
        <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
        <Divider />
        <SummaryYourDeposit state={state} />
        <SummaryTheSwap state={state} transactionType={transactionType} />
        <SummaryWhileSwapping
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          priceThresholdValue={state.priceThresholdValue}
          slippageTolerance={state.slippageTolerance}
        />
        <SummaryAfterEachSwap state={state} />
        <Fees
          swapFee={SWAP_FEE}
          initialDenom={initialDenom}
          resultingDenom={resultingDenom}
          autoStakeValidator={state.autoStakeValidator}
          swapAmount={state.swapAmount}
          transactionType={transactionType}
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
        strategyType: StrategyType.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <ModalWrapper stepsConfig={dcaInSteps} reset={resetForm(FormNames.DcaIn)}>
        <Page />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
