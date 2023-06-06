import {
  Heading,
  Grid,
  GridItem,
  Text,
  Divider,
  Flex,
  HStack,
  Spinner,
  Stack,
  Code,
  VStack,
  Center,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { getDenomName } from '@utils/getDenomInfo';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@hooks/useStrategies';
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
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { getPerformanceStatistics } from './getPerformanceStatistics';

function LoopedStrategyDetails({
  strategy,
  marketValueInFiat,
  data,
}: {
  strategy: Strategy;
  marketValueInFiat: number;
  data: any;
}) {
  const id = getStrategyReinvestStrategyId(data.vault);
  const { data: linkedData } = useStrategy(id);

  const linkedStrategy = data.vault as Strategy;

  const initialDenom = data === 'string' ? getStrategyInitialDenom(linkedStrategy) : '';
  const resultingDenom = data === 'string' ? getStrategyResultingDenom(linkedStrategy) : '';
  const { dexFee } = useDexFee(
    initialDenom,
    resultingDenom,
    isBuyStrategy(linkedStrategy) ? TransactionType.Buy : TransactionType.Sell,
  );

  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  console.log('price', useFiatPrice(initialDenom), useFiatPrice(resultingDenom));

  const { vault: reinvestStrategy } = linkedData || {};
  const checkLoopedStrategy = reinvestStrategy && getStrategyReinvestStrategyId(reinvestStrategy);
  const isLooped = checkLoopedStrategy === strategy.id;

  const {
    color,
    percentageChange,
    profit,
    marketValueInFiat: linkedMarketValueInFiat,
  } = getPerformanceStatistics(linkedStrategy, initialDenomPrice, resultingDenomPrice, dexFee);

  const linkedValue = formatFiat(linkedMarketValueInFiat);
  console.log(linkedStrategy, initialDenomPrice, resultingDenomPrice, dexFee);

  console.log(color, percentageChange, profit, linkedMarketValueInFiat);

  if (reinvestStrategy) {
    return (
      <Grid templateColumns="repeat(8, 1fr)" gap={1} w="full">
        <GridItem colSpan={3}>
          <VStack
            layerStyle="panel"
            flexGrow={1}
            alignItems="start"
            bgColor="gray.800"
            h="full"
            spacing={1}
            fontSize="xs"
            p={2}
          >
            <HStack w="full">
              <Text>Strategy ID:</Text>
              <Text>
                {!reinvestStrategy ? (
                  <Spinner size="xs" />
                ) : (
                  <>
                    <Code
                      bgColor="abyss.200"
                      fontSize="xx-small"
                      variant="outline"
                      display={{ base: 'none', lg: 'contents' }}
                    >
                      id: {strategy.id}
                    </Code>
                    <Code
                      bg="abyss.200"
                      fontSize="xx-small"
                      display={{ base: 'contents', lg: 'none' }}
                      whiteSpace="nowrap"
                    >
                      {strategy.id}
                    </Code>
                  </>
                )}{' '}
              </Text>
            </HStack>

            <Text>
              Value:
              {formatFiat(marketValueInFiat)}
            </Text>
          </VStack>{' '}
        </GridItem>
        <GridItem colSpan={1}>
          {isLooped ? (
            <VStack alignItems="center" justifyContent="center">
              <ArrowForwardIcon boxSize={6} />
              <ArrowBackIcon boxSize={6} />
            </VStack>
          ) : (
            <Flex alignItems="center" justifyContent="center">
              <ArrowForwardIcon boxSize={6} />
            </Flex>
          )}
        </GridItem>
        <GridItem colSpan={4}>
          <Stack
            layerStyle="panel"
            flexGrow={1}
            alignItems="start"
            bgColor="gray.800"
            h="full"
            spacing={1}
            fontSize="xs"
            p={2}
            mr={14}
          >
            <Text>Strategy ID: {linkedStrategy.id}</Text>
            <Text>Value: {linkedValue} </Text>
          </Stack>{' '}
        </GridItem>
      </Grid>
    );
  }

  return (
    <GridItem colSpan={2}>
      <Divider />
    </GridItem>
  );
}

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
  console.log(color, percentageChange, profit, marketValueInFiat);

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
            ? formatFiat(getAveragePurchasePrice(strategy, dexFee) * initialDenomPrice)
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
          <GridItem colSpan={1}>
            <Heading size="xs">{isBuyStrategy(strategy) ? 'Profit/Loss' : 'Profit taken'}</Heading>
          </GridItem>
        </>
      )}
      <GridItem colSpan={2}>
        <Divider />
      </GridItem>
      {data && (
        <>
          <GridItem colSpan={1}>
            <Heading size="xs">Linked strategy total value:</Heading>
          </GridItem>
          <GridItem colSpan={1}>
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
          </GridItem>
          <GridItem colSpan={2}>
            <LoopedStrategyDetails strategy={strategy} marketValueInFiat={marketValueInFiat} data={data} />
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
