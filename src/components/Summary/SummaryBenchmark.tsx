import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { useDenom } from '@hooks/useDenom/useDenom';

export function SummaryBenchmark({ state }: { state: DcaPlusState }) {
  const { initialDenom, resultingDenom, initialDeposit, strategyDuration } = state;

  const initialDenomInfo = useDenom(initialDenom);
  const resultingDenomInfo = useDenom(resultingDenom);

  const swapAmount = Number(getSwapAmountFromDuration(initialDeposit, strategyDuration).toFixed(3));

  return (
    <Box data-testid="summary-benchmark">
      <Text textStyle="body-xs">Benchmark</Text>
      <Text lineHeight={8}>
        The DCA+ performance will be benchmarked against a daily swap of{' '}
        <BadgeButton url="customise">
          <Text>
            {swapAmount} {initialDenomInfo.name}
          </Text>
          <DenomIcon denomInfo={initialDenomInfo} />{' '}
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="assets">
          <Text>{resultingDenomInfo.name}</Text>
          <DenomIcon denomInfo={resultingDenomInfo} />{' '}
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton url="customise">
          <Text>{strategyDuration} days</Text>
        </BadgeButton>
        .
      </Text>
    </Box>
  );
}
