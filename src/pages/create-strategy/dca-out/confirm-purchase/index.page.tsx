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
import { FormNames } from '@hooks/useFormStore';
import { SWAP_FEE } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';

function Page() {
  const { state, actions } = useConfirmForm(FormNames.DcaOut);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(dcaOutSteps);
  const { price } = useFiatPrice(state?.initialDenom);

  const { mutate, isError, error, isLoading } = useCreateVaultDca(FormNames.DcaOut, TransactionType.Sell);

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

  const transactionType = TransactionType.Sell;

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={dcaOutSteps} resetForm={actions.resetAction}>
        Confirm &amp; Sign
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={dcaOutSteps} isLoading={isPageLoading && !price} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAOut} />
            <SummaryTheSwap state={state} transactionType={transactionType} />
            <SummaryWhileSwapping
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              priceThresholdValue={state.priceThresholdValue}
              slippageTolerance={state.slippageTolerance}
              transactionType={transactionType}
            />
            <SummaryAfterEachSwap state={state} />
            <Fees state={state} transactionType={TransactionType.Sell} swapFee={SWAP_FEE} />
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
