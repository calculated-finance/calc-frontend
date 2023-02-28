import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';

export function SummaryYourDeposit({ state }: any) {
  const { initialDenom, initialDeposit } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);

  return (
    <Box data-testid="summary-your-deposit">
      <Text textStyle="body-xs">Your deposit</Text>
      <Text lineHeight={8}>
        I deposit{' '}
        <BadgeButton url="assets">
          <Text>
            {initialDeposit} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />{' '}
        </BadgeButton>{' '}
        Into the CALC DCA In vault.
      </Text>
    </Box>
  );
}
