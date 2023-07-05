import { Heading, Grid, GridItem, Text, Divider, Flex, HStack, Spinner, Center } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { getDenomName } from '@utils/getDenomInfo';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@models/Strategy';
import { formatFiat } from '@helpers/format/formatFiat';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { isNil } from 'lodash';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  isBuyStrategy,
  getAveragePurchasePrice,
  getAverageSellPrice,
  getTotalReceived,
  getTotalSwapped,
} from '@helpers/strategy';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import CalcSpinner from '@components/Spinner';
import { getStrategyReinvestStrategyId } from '@helpers/destinations';
import useStrategy from '@hooks/useStrategy';
import { featureFlags } from 'src/constants';
import { getPerformanceStatistics } from './getPerformanceStatistics';
import { LinkedStrategyDetails } from './LinkedStrategyDetails';

function StrategyPerformanceDetails({ strategy }: { strategy: Strategy }) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const { dexFee } = useDexFee(
    initialDenom,
    resultingDenom,
    isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell,
  );

  const id = getStrategyReinvestStrategyId(strategy);
  const { data } = useStrategy(id);
  const linkedToStrategy = data;
  const { price: resultingDenomPrice, priceChange24Hr: resultingPriceChange24Hr } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice, priceChange24Hr: initialPriceChange24Hr } = useFiatPrice(initialDenom);

  if (!resultingDenomPrice || !initialDenomPrice) {
    return (
      <Flex align="center" justify="center" h="full" gap={3} px={8} py={6} w="full">
        <Center>
          <CalcSpinner />
        </Center>
      </Flex>
    );
  }

  const priceChange = isBuyStrategy(strategy) ? resultingPriceChange24Hr : initialPriceChange24Hr;
  const { color, percentageChange, profit, marketValueInFiat } = getPerformanceStatistics(
    strategy,
    initialDenomPrice,
    resultingDenomPrice,
    dexFee,
  );

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={3} px={8} py={6} w="full">
      <GridItem colSpan={1}>
        <Heading size="xs">Asset in</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex align="center" gap={2} data-testid="strategy-initial-denom">
          <Text fontSize="sm">{getDenomName(initialDenom)}</Text> <DenomIcon denomInfo={initialDenom} />
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Asset out</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex align="center" gap={2} data-testid="strategy-resulting-denom">
          <Text fontSize="sm">{getDenomName(resultingDenom)}</Text> <DenomIcon denomInfo={resultingDenom} />
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
            ? formatFiat(getAveragePurchasePrice(strategy, dexFee), getStrategyInitialDenom(strategy).name)
            : !isBuyStrategy(strategy) && resultingDenom.stable
            ? formatFiat(getAverageSellPrice(strategy, dexFee), getStrategyResultingDenom(strategy).name)
            : formatFiat(getAverageSellPrice(strategy, dexFee) * resultingDenomPrice)}
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Divider />
      </GridItem>

      <GridItem colSpan={1}>
        <Heading size="xs">
          <Text fontSize="sm">
            {isBuyStrategy(strategy) ? getDenomName(resultingDenom) : getDenomName(initialDenom)} price
          </Text>
        </Heading>
      </GridItem>

      <GridItem colSpan={1}>
        {isNil(priceChange) ? (
          <Spinner size="xs" />
        ) : (
          <Flex>
            <HStack color={priceChange > 0 ? 'green.200' : 'red.200'} whiteSpace="nowrap">
              <Text fontSize="sm" data-testid="strategy-asset-price">
                {isBuyStrategy(strategy) ? formatFiat(resultingDenomPrice) : formatFiat(initialDenomPrice)}
              </Text>
              <HStack spacing={1}>
                {priceChange > 0 ? <HiTrendingUp /> : <HiTrendingDown />}

                <Text fontSize="xs" data-testid="strategy-asset-price-change">
                  {formatSignedPercentage(priceChange / 100)}
                </Text>
              </HStack>
            </HStack>
          </Flex>
        )}
      </GridItem>

      <GridItem colSpan={1}>
        <Heading size="xs">{isBuyStrategy(strategy) ? 'Profit/Loss' : 'Amount swapped'}</Heading>
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

      {linkedToStrategy && featureFlags.reinvestVisualsEnabled && (
        <>
          <GridItem colSpan={2}>
            <Divider />
          </GridItem>
          <LinkedStrategyDetails
            originalStrategy={strategy}
            linkedToStrategy={linkedToStrategy}
            linkedStrategyInitialPrice={resultingDenomPrice}
            originalStrategyInitialPrice={initialDenomPrice}
          />
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
