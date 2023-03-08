import { Divider, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
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
import { getTimeSaved } from '../../../../helpers/getTimeSaved';
import Fees from '../../../../components/Fees';
import dcaOutSteps from '../../../../formConfig/dcaOut';

function Page() {
  const { state, actions } = useConfirmForm(FormNames.DcaOut);
  const { isPageLoading } = usePageLoad();
  const { nextStep, goToStep } = useSteps(dcaOutSteps);

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

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={dcaOutSteps} resetForm={actions.resetAction}>
        Confirm &amp; Sign
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={dcaOutSteps} isLoading={isPageLoading} isSigning={isLoading}>
        {state ? (
          <Stack spacing={4}>
            <DcaDiagram
              initialDenom={state.initialDenom}
              resultingDenom={state.resultingDenom}
              initialDeposit={state.initialDeposit}
            />
            <Divider />
            <SummaryYourDeposit state={state} strategyType={StrategyTypes.DCAOut} />
            <SummaryTheSwap state={state} />
            <SummaryWhileSwapping state={state} />
            <SummaryAfterEachSwap state={state} />
            <Fees formName={FormNames.DcaOut} />
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
