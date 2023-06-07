import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { StepConfig } from 'src/formConfig/StepConfig';

export function ModalWrapper({
  isLoading,
  reset,
  children,
  stepsConfig,
}: {
  isLoading: boolean;
  children?: React.ReactNode;
  reset: () => void;
  stepsConfig: StepConfig[];
}) {
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={stepsConfig} resetForm={reset} />
      <NewStrategyModalBody stepsConfig={stepsConfig} isLoading={isLoading}>
        {children}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
