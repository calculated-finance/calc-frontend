import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { SigningState } from '@components/NewStrategyModal';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import { useCreateVaultDca } from '@hooks/useCreateVault/useCreateVaultDca';
import { FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryTheSwap } from '@components/Summary/SummaryTheSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { StrategyTypes } from '@models/StrategyTypes';
import Fees from '@components/Fees';
import { getTimeSaved } from '@helpers/getTimeSaved';
import dcaOutSteps from '@formConfig/dcaOut';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { SWAP_FEE } from 'src/constants';
import getDenomInfo from '@utils/getDenomInfo';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import useStrategy from '@hooks/useStrategy';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { state, actions } = useConfirmForm();
  const { nextStep, goToStep } = useSteps(dcaOutSteps);

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = getDenomInfo(state?.resultingDenom);

  const { mutate, isError, error, isLoading } = useCreateVaultDca(initialDenom);
  const { data: reinvestStrategyData } = useStrategy(state?.reinvestStrategy);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { state, reinvestStrategyData },
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

  const transactionType = TransactionType.Sell;

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

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
        strategyType: StrategyTypes.DCAOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaOut,
      }}
    >
      <ModalWrapper stepsConfig={dcaOutSteps} reset={resetForm(FormNames.DcaOut)}>
        <Page />
      </ModalWrapper>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
