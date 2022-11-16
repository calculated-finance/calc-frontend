import { Heading, Grid, GridItem, Text, Divider, Flex } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import { isNaN } from 'lodash';
import { getStrategyType } from '../../../helpers/getStrategyType';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getPerformanceStatistics } from './getPerformanceStatistics';

export function formatFiat(value: number) {
  return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    !isNaN(value) ? value : 0,
  )} USD`;
}

export default function StrategyPerformance({ strategy }: { strategy: Strategy }) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { price: resultingDenomPrice, isLoading: resultingDenomPriceIsLoading } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice, isLoading: initialDenomPriceIsLoading } = useFiatPrice(initialDenom);

  if (resultingDenomPriceIsLoading || initialDenomPriceIsLoading) {
    return null;
  }

  const { color, percentageChange, marketValueValue, costValue, profit } = getPerformanceStatistics(
    strategy,
    initialDenomPrice,
    resultingDenomPrice,
  );

  return (
    <GridItem colSpan={[6, null, null, null, 3]}>
      <Flex h="full" flexDirection="column">
        <Heading pb={4} size="md">
          Strategy performance
        </Heading>
        <Flex layerStyle="panel" flexGrow={1} alignItems="start">
          <Grid templateColumns="repeat(2, 1fr)" gap={3} px={8} py={6} w="full">
            <GridItem colSpan={1}>
              <Heading size="xs">Asset in</Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Flex align="center" gap={2} data-testid="strategy-resulting-denom">
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
              <Heading size="xs">
                {getStrategyType(strategy) === StrategyTypes.DCAIn
                  ? 'Market value of holdings'
                  : 'Market value of profits'}
              </Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontSize="sm">{formatFiat(marketValueValue.toConverted() * resultingDenomPrice)}</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Heading size="xs">
                {getStrategyType(strategy) === StrategyTypes.DCAIn ? 'Total accumulated' : 'Total sold'}
              </Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontSize="sm">
                {getStrategyType(strategy) === StrategyTypes.DCAIn
                  ? `${marketValueValue.toConverted()} ${getDenomInfo(marketValueValue.denomId).name}`
                  : `${costValue.toConverted()} ${getDenomInfo(costValue.denomId).name}`}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Heading size="xs">
                {getStrategyType(strategy) === StrategyTypes.DCAIn ? 'Net asset cost' : 'Net asset profit'}
              </Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontSize="sm">
                {getStrategyType(strategy) === StrategyTypes.DCAIn
                  ? `${costValue.toConverted()} ${getDenomInfo(costValue.denomId).name}`
                  : `${marketValueValue.toConverted()} ${getDenomInfo(marketValueValue.denomId).name}`}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Heading size="xs">
                {getStrategyType(strategy) === StrategyTypes.DCAIn ? 'Average token cost' : 'Average token sell price'}
              </Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontSize="sm">
                {getStrategyType(strategy) === StrategyTypes.DCAIn
                  ? formatFiat((costValue.toConverted() / marketValueValue.toConverted()) * initialDenomPrice)
                  : formatFiat((marketValueValue.toConverted() / costValue.toConverted()) * resultingDenomPrice)}
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Divider />
            </GridItem>
            <GridItem colSpan={1}>
              <Heading size="xs">{getStrategyType(strategy) === StrategyTypes.DCAIn ? 'Profit/Loss' : 'Profit taken'}</Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Text color={color} fontSize="sm">
                {getStrategyType(strategy) === StrategyTypes.DCAIn ? formatFiat(profit) : formatFiat(profit)}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Heading size="xs">% change</Heading>
            </GridItem>
            <GridItem colSpan={1}>
              <Text color={color} fontSize="sm">
                {percentageChange}
              </Text>
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
    </GridItem>
  );
}
