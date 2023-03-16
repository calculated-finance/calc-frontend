import { Stat, StatNumber, Stack, StatLabel, StatHelpText, StatArrow } from '@chakra-ui/react';
import { StrategyEvent } from '@hooks/useStrategyEvents';
import { Strategy } from '@hooks/useStrategies';
import useFiatPrice from '@hooks/useFiatPrice';
import { formatFiat } from '@helpers/format/formatFiat';
import { getStrategyInitialDenom, getStrategyResultingDenom, isBuyStrategy } from '@helpers/strategy';
import { getPerformanceStatistics } from './getPerformanceStatistics';

export function StrategyChartStats({
  strategy,
  strategyEvents,
}: {
  strategy: Strategy;
  strategyEvents: StrategyEvent[];
}) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const { color, percentageChange, profit, marketValueInFiat } = getPerformanceStatistics(
    strategy,
    initialDenomPrice,
    resultingDenomPrice,
    strategyEvents,
  );
  return (
    <Stack spacing={3} pt={6} pl={6}>
      <Stat>
        <StatLabel fontSize="lg">Strategy market value</StatLabel>
        <StatNumber>{formatFiat(marketValueInFiat)}</StatNumber>
        {isBuyStrategy(strategy) && (
          <StatHelpText color={color} m={0}>
            <StatArrow type={color === 'green.200' ? 'increase' : 'decrease'} color={color} />
            {formatFiat(profit)} : {percentageChange}
          </StatHelpText>
        )}
      </Stat>
    </Stack>
  );
}
