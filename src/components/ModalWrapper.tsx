import { Box } from '@chakra-ui/react';
import { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import React, { Suspense } from 'react';
import { StepConfig } from 'src/formConfig/StepConfig';

const NewStrategyModal = lazy(() => import('@components/NewStrategyModal'));

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
    <Suspense fallback={<Box />}>
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={stepsConfig} resetForm={reset} cancelUrl="/create-strategy" />
        <NewStrategyModalBody stepsConfig={stepsConfig} isLoading={isPageLoading}>
          {children}
        </NewStrategyModalBody>
      </NewStrategyModal>
    </Suspense>
  );
}
