import { Stack } from '@chakra-ui/react';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import { Form, useFormikContext } from 'formik';
import Submit from '@components/Submit';
import { TransactionType } from '@components/TransactionType';
import ExecutionInterval from '@components/ExecutionInterval';
import DcaDiagram from '@components/DcaDiagram';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import PriceThreshold from '@components/PriceThreshold';
import { DcaInFormDataStep1, DcaInFormDataStep2 } from '@models/DcaInFormData';
import SlippageTolerance from '@components/SlippageTolerance';
import SwapAmount from '@components/SwapAmount';
import { TriggerForm } from '@components/TriggerForm';
import { FormNames } from '@hooks/useFormStore';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { StepConfig } from '@formConfig/StepConfig';
import getDenomInfo from '@utils/getDenomInfo';

export function CustomiseFormDca({
  steps,
  step1,
  resetAction,
  transactionType,
  formName,
}: {
  steps: StepConfig[];
  step1: DcaInFormDataStep1;
  resetAction?: () => void;
  transactionType: TransactionType;
  formName: FormNames;
}) {
  const { isPageLoading } = usePageLoad();
  const { values, isSubmitting } = useFormikContext<DcaInFormDataStep2>();

  const initialDenom = getDenomInfo(step1.initialDenom);
  const resultingDenom = getDenomInfo(step1.resultingDenom);
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} resetForm={resetAction} />
      <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
        <Form autoComplete="off">
          <Stack direction="column" spacing={4}>
            <DcaDiagram
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
              initialDeposit={step1.initialDeposit}
            />
            <AdvancedSettingsSwitch />
            <TriggerForm
              transactionType={transactionType}
              initialDenom={initialDenom}
              resultingDenom={resultingDenom}
            />
            <ExecutionInterval />
            <SwapAmount step1State={step1} isSell={transactionType === TransactionType.Sell} />
            <CollapseWithRender isOpen={values.advancedSettings}>
              <PriceThreshold
                initialDenom={initialDenom}
                resultingDenom={resultingDenom}
                transactionType={transactionType}
              />
              <SlippageTolerance />
            </CollapseWithRender>
            <Submit>Next</Submit>
          </Stack>
        </Form>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
