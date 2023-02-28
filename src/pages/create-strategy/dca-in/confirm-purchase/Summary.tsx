import { Divider, Stack } from '@chakra-ui/react';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import { SummaryTheSwap } from '@components/Summary/SummaryTheSwap';
import { SummaryWhileSwapping } from '@components/Summary/SummaryWhileSwapping';
import { SummaryYourDeposit } from '@components/Summary/SummaryYourDeposit';
import { SummaryAfterEachSwap } from '@components/Summary/SummaryAfterEachSwap';
import DcaDiagram from '@components/DcaDiagram';

export default function Summary() {
  const { state } = useConfirmForm(FormNames.DcaIn);

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const { initialDenom, resultingDenom, initialDeposit } = state;

  return (
    <Stack spacing={4}>
      <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} initialDeposit={initialDeposit} />
      <Divider />
      <SummaryYourDeposit state={state} />
      <SummaryTheSwap state={state} />
      <SummaryWhileSwapping state={state} />
      <SummaryAfterEachSwap state={state} />
    </Stack>
  );
}
