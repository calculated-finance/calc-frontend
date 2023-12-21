import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';

export function SummaryYourDeposit({ state }: { state: DcaFormState }) {
  const { initialDenom, initialDeposit } = state;
  const { strategyType } = useStrategyInfo();

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
