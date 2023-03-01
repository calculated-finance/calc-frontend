import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';

export function SummaryBenchmark({ state }: any) {
  const { initialDenom, resultingDenom } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const swapAmount = 20;

  return (
    <Box data-testid="summary-benchmark">
      <Text textStyle="body-xs">Benchmark</Text>
      <Text lineHeight={8}>
        The DCA+ performance will be benchmarked against a daily swap of{' '}
        <BadgeButton url="assets">
          <Text>
            {swapAmount} {initialDenomName}
          </Text>
          <DenomIcon denomName={initialDenom} />{' '}
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomName}</Text>
          <DenomIcon denomName={resultingDenom} />{' '}
        </BadgeButton>{' '}
      </Text>
    </Box>
  );
}
