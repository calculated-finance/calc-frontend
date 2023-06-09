import { Heading, Grid, GridItem, Text, Flex, HStack, Spinner, Stack, Code, VStack } from '@chakra-ui/react';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@hooks/useStrategies';
import { formatFiat } from '@helpers/format/formatFiat';
import { getStrategyInitialDenom, getStrategyResultingDenom, isBuyStrategy } from '@helpers/strategy';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import { getStrategyReinvestStrategyId } from '@helpers/destinations';
import useStrategy from '@hooks/useStrategy';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { getPerformanceStatistics } from './getPerformanceStatistics';

export function LinkedStrategyDetails({
  originalStrategy,
  marketValueInFiat,
  linkedToStrategy,
}: {
  originalStrategy: Strategy;
  marketValueInFiat: number;
  linkedToStrategy: Strategy;
}) {
  const curStrategy = linkedToStrategy;
  const linkingIntoId = getStrategyReinvestStrategyId(curStrategy);
  const { data: linkedData } = useStrategy(linkingIntoId);

  const initialDenom = getStrategyInitialDenom(curStrategy);
  const resultingDenom = getStrategyResultingDenom(curStrategy);
  const { dexFee } = useDexFee(
    initialDenom,
    resultingDenom,
    isBuyStrategy(curStrategy) ? TransactionType.Buy : TransactionType.Sell,
  );

  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const { vault: reinvestStrategy } = linkedData || {};
  const checkLoopedStrategy = reinvestStrategy && getStrategyReinvestStrategyId(reinvestStrategy);
  const isLooped = originalStrategy.id === linkingIntoId;

  const {
    color,
    percentageChange,
    profit,
    marketValueInFiat: linkedMarketValueInFiat,
  } = getPerformanceStatistics(curStrategy, initialDenomPrice, resultingDenomPrice, dexFee);

  const value = formatFiat(marketValueInFiat);
  const linkedValue = formatFiat(linkedMarketValueInFiat);

  const totalValue = formatFiat(marketValueInFiat + linkedMarketValueInFiat);

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Linked strategy total value:</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-asset-price">
          {totalValue}
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
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
                <Text fontWeight="bold">This Strategy:</Text>
                <Text>
                  {!reinvestStrategy ? (
                    <Spinner size="xs" />
                  ) : (
                    <>
                      <Code fontSize="xx-small" display={{ base: 'none', lg: 'contents' }}>
                        id: {originalStrategy.id}
                      </Code>
                      <Code fontSize="xx-small" display={{ base: 'contents', lg: 'none' }} whiteSpace="nowrap">
                        id: {originalStrategy.id}
                      </Code>
                    </>
                  )}{' '}
                </Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Value:</Text>
                <Text> {value}</Text>
              </HStack>
            </VStack>{' '}
          </GridItem>
          <GridItem colSpan={1}>
            {isLooped ? (
              <VStack alignItems="center" justifyContent="center">
                <ArrowForwardIcon boxSize={6} />
                <ArrowBackIcon boxSize={6} />
              </VStack>
            ) : (
              <Flex justify="center" py={4}>
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
            >
              <HStack>
                <Text fontWeight="bold">Linked Strategy: </Text>
                <Text>
                  <>
                    <Code fontSize="xx-small" display={{ base: 'none', lg: 'contents' }}>
                      id: {checkLoopedStrategy}
                    </Code>
                    <Code fontSize="xx-small" display={{ base: 'contents', lg: 'none' }} whiteSpace="nowrap">
                      id: {checkLoopedStrategy}
                    </Code>
                  </>
                </Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Value:</Text>
                <Text> {linkedValue} </Text>
              </HStack>
            </Stack>{' '}
          </GridItem>
        </Grid>
      </GridItem>
    </>
  );
}
