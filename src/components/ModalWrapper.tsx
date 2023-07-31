import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import { StepConfig } from 'src/formConfig/StepConfig';

export function ModalWrapper({
  reset,
  children,
  stepsConfig,
}: {
  children?: React.ReactNode;
  reset?: () => void;
  stepsConfig: StepConfig[];
}) {
  const { isPageLoading } = usePageLoad();

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={stepsConfig} resetForm={reset} cancelUrl="/create-strategy" />
      <NewStrategyModalBody stepsConfig={stepsConfig} isLoading={isPageLoading}>
        {children}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
