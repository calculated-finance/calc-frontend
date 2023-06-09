import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { StrategyTypes } from '@models/StrategyTypes';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';
import { useDenom } from '@hooks/useDenom/useDenom';

export function SummaryYourDeposit({ state, strategyType }: { state: DcaFormState; strategyType: StrategyTypes }) {
  const { initialDenom: initialDenomId, initialDeposit } = state;

  const initialDenom = useDenom(initialDenomId);

  return (
    <Box data-testid="summary-your-deposit">
      <Text textStyle="body-xs">Your deposit</Text>
      <Text lineHeight={8}>
        I deposit{' '}
        <BadgeButton url="assets">
          <Text>
            {initialDeposit} {initialDenom.name}
          </Text>
          <DenomIcon denomInfo={initialDenom} />{' '}
        </BadgeButton>{' '}
        Into the CALC {strategyType} vault.
      </Text>
    </Box>
  );
}
