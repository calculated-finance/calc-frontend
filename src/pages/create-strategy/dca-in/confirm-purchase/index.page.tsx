import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { useConfirmForm } from 'src/hooks/useDcaInForm';
import { useCreateVaultDca } from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import { TransactionType } from '@components/TransactionType';
import { InvalidData } from '@components/InvalidData';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import DcaDiagram from '@components/DcaDiagram';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import { SummaryTheSwap } from '@components/Summary/SummaryTheSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { FormikHelpers } from 'formik';
import { StrategyTypes } from '@models/StrategyTypes';
import Fees from '@components/Fees';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { FormNames } from '@hooks/useFormStore';
import { SWAP_FEE } from 'src/constants';
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';

function Page() {
  const { state, actions } = useConfirmForm(FormNames.DcaIn);
  const { isPageLoading } = usePageLoad();
  const { price } = useFiatPrice(state && getDenomInfo(state.initialDenom));
  const { nextStep, goToStep } = useSteps(steps);

  const { mutate, isError, error, isLoading } = useCreateVaultDca(FormNames.DcaIn, TransactionType.Buy);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(price, {
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

  const transactionType = TransactionType.Buy;

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction} />
      <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading || !price} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={getDenomInfo(state.initialDenom)}
              resultingDenom={getDenomInfo(state.resultingDenom)}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAIn} />
            <SummaryTheSwap state={state} transactionType={transactionType} />
            <SummaryWhileSwapping
              initialDenom={getDenomInfo(state.initialDenom)}
              resultingDenom={getDenomInfo(state.resultingDenom)}
              priceThresholdValue={state.priceThresholdValue}
              slippageTolerance={state.slippageTolerance}
              transactionType={transactionType}
            />
            <SummaryAfterEachSwap state={state} />
            <Fees state={state} transactionType={TransactionType.Buy} swapFee={SWAP_FEE} />
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
