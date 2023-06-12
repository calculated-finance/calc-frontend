import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import { useCreateVaultDca } from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
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
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';
import { useDenom } from '@hooks/useDenom/useDenom';
import { ModalWrapper } from '@components/ModalWrapper';

function Page() {
  const { state, actions } = useConfirmForm(FormNames.DcaOut);
  const { nextStep, goToStep } = useSteps(dcaOutSteps);

  const initialDenom = useDenom(state?.initialDenom);
  const resultingDenom = getDenomInfo(state?.resultingDenom);

  const { price } = useFiatPrice(initialDenom);

  const { mutate, isError, error } = useCreateVaultDca(FormNames.DcaOut, TransactionType.Sell);

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

  const transactionType = TransactionType.Sell;

  if (!state) {
    return <InvalidData onRestart={handleRestart} />;
  }

  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={state.initialDeposit} />
      <Divider />
      <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAOut} />
      <SummaryTheSwap state={state} transactionType={transactionType} />
      <SummaryWhileSwapping
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        priceThresholdValue={state.priceThresholdValue}
        slippageTolerance={state.slippageTolerance}
        transactionType={transactionType}
      />
      <SummaryAfterEachSwap state={state} />
      <Fees
        transactionType={TransactionType.Sell}
        swapFee={SWAP_FEE}
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        autoStakeValidator={state.autoStakeValidator}
        swapAmount={state.swapAmount}
      />
      <SummaryAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
    </Stack>
  );
}
function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <ModalWrapper stepsConfig={dcaOutSteps} reset={resetForm(FormNames.DcaOut)}>
      <Page />
    </ModalWrapper>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
