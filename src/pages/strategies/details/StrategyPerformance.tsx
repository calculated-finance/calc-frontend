import { Heading, Grid, GridItem, Text, Divider, Flex, Center } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@hooks/useStrategies';
import { formatFiat } from '@helpers/format/formatFiat';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  isBuyStrategy,
  getAveragePurchasePrice,
  getAverageSellPrice,
  getTotalReceived,
  getTotalSwapped,
} from '@helpers/strategy';
import { getPerformanceStatistics } from './getPerformanceStatistics';

function StrategyPerformanceDetails({ strategy }: { strategy: Strategy }) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const { color, percentageChange, profit, marketValueInFiat } = getPerformanceStatistics(
    strategy,
    initialDenomPrice,
    resultingDenomPrice,
  );

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={3} px={8} py={6} w="full">
      <GridItem colSpan={1}>
        <Heading size="xs">Asset in</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex align="center" gap={2} data-testid="strategy-initial-denom">
          <Text fontSize="sm">{getDenomInfo(initialDenom).name}</Text> <DenomIcon denomName={initialDenom} />
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Asset out</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex align="center" gap={2} data-testid="strategy-resulting-denom">
          <Text fontSize="sm">{getDenomInfo(resultingDenom).name}</Text> <DenomIcon denomName={resultingDenom} />
        </Flex>
      </GridItem>
      <GridItem colSpan={2}>
        <Divider />
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Market value of holdings' : 'Market value of profits'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-market-value">
          {formatFiat(marketValueInFiat)}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Total accumulated' : 'Total sold'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-total-acculumated">
          {isBuyStrategy(strategy)
            ? `${getTotalReceived(strategy)} ${getDenomName(getStrategyResultingDenom(strategy))}`
            : `${getTotalSwapped(strategy)} ${getDenomName(getStrategyInitialDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Total swapped' : 'Total asset profit'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-net-cost">
          {isBuyStrategy(strategy)
            ? `${getTotalSwapped(strategy)} ${getDenomName(getStrategyInitialDenom(strategy))}`
            : `${getTotalReceived(strategy)} ${getDenomName(getStrategyResultingDenom(strategy))}`}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Average token cost' : 'Average token sell price'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-average-token-cost">
          {isBuyStrategy(strategy)
            ? formatFiat(getAveragePurchasePrice(strategy) * initialDenomPrice)
            : formatFiat(getAverageSellPrice(strategy) * resultingDenomPrice)}
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Divider />
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Profit/Loss' : 'Profit taken'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        {isBuyStrategy(strategy) ? (
          <Text color={color} fontSize="sm" data-testid="strategy-profit">
            {formatFiat(profit)}
          </Text>
        ) : (
          <Text color={marketValueInFiat > 0 ? 'green.200' : 'white'} data-testid="strategy-profit-taken" fontSize="sm">
            {formatFiat(marketValueInFiat)}
          </Text>
        )}
      </GridItem>
      {isBuyStrategy(strategy) && (
        <>
          <GridItem colSpan={1}>
            <Heading size="xs">% change</Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <Text color={color} fontSize="sm">
              {percentageChange}
            </Text>
          </GridItem>
        </>
      )}
    </Grid>
  );
}

export default function StrategyPerformance({ strategy }: { strategy: Strategy }) {
  return (
    <GridItem colSpan={[6, null, null, null, 3]}>
      <Flex h="full" flexDirection="column">
        <Heading pb={4} size="md">
          Strategy performance
        </Heading>
        <Flex layerStyle="panel" flexGrow={1} alignItems="start">
          <StrategyPerformanceDetails strategy={strategy} />
        </Flex>
      </Flex>
    </GridItem>
  );
}
