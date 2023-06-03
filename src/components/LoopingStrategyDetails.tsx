import { Heading, Grid, GridItem, Box, Text, Divider, Badge, Flex, HStack, Code } from '@chakra-ui/react';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';

import { StrategyOsmosis } from '@hooks/useStrategies';
import { StrategyTypes } from '@models/StrategyTypes';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyType,
  getStrategyStartDate,
  isStrategyCancelled,
  getStrategyName,
  getSlippageTolerance,
  getPriceCeilingFloor,
  getStrategyExecutionInterval,
} from '@helpers/strategy';
import { StrategyStatusBadge } from '@components/StrategyStatusBadge';

import { SwapEachCycle } from 'src/pages/strategies/details/StrategyDetails';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import usePairs from '@hooks/usePairs';
import { DestinationDetails } from 'src/pages/strategies/details/DestinationDetails';

export function LoopingStrategyDetails({ strategy }: { strategy: StrategyOsmosis }) {
  const { balance } = strategy;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const initialDenomValue = new DenomValue(balance);

  const strategyType = getStrategyType(strategy);
  const { data: pairsData } = usePairs();

  const startDate = getStrategyStartDate(strategy, pairsData?.pairs);

  return (
    <GridItem colSpan={[6, null, null, null, 3]}>
      <Box px={8} py={6} bg="abyss.200" p={4} fontSize="sm" borderRadius="xl" borderWidth={1} borderColor="slateGrey">
        <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center">
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy status</Heading>
          </GridItem>
          <GridItem colSpan={1} data-testid="strategy-status">
            <StrategyStatusBadge strategy={strategy} />
          </GridItem>
          <GridItem colSpan={1} visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}>
            <Flex justifyContent="end" />
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy name</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-name">
              {getStrategyName(strategy)}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy id</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Code bg="abyss.200" fontSize="small" whiteSpace="nowrap">
              {strategy.id}
            </Code>
          </GridItem>
          <GridItem colSpan={3}>
            <Divider />
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy type</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-type">
              {strategyType}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy start date</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-start-date">
              {startDate}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Investment cycle</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-investment-cycle">
              {getStrategyExecutionInterval(strategy)}
            </Text>
          </GridItem>
          {!isWeightedScale(strategy) && <SwapEachCycle strategy={strategy} />}
          {Boolean(strategy.slippage_tolerance) && (
            <>
              <GridItem colSpan={1}>
                <Heading size="xs">Slippage tolerance</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize="sm" data-testid="strategy-slippage-tolerance">
                  {getSlippageTolerance(strategy)}
                </Text>
              </GridItem>
            </>
          )}
          {Boolean(strategy.minimum_receive_amount) && strategy.minimum_receive_amount && (
            <>
              <GridItem colSpan={1}>
                <Heading size="xs">{strategyType === StrategyTypes.DCAIn ? 'Price ceiling' : 'Price floor'}</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack>
                  <Text fontSize="sm" data-testid="strategy-minimum-receive-amount">
                    {getPriceCeilingFloor(strategy)}{' '}
                    {getDenomInfo(strategyType === StrategyTypes.DCAIn ? initialDenom : resultingDenom).name}
                  </Text>
                  <Badge colorScheme="green">Set</Badge>
                </HStack>
              </GridItem>
            </>
          )}
          <GridItem colSpan={1}>
            <Heading size="xs">Current amount in vault</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-current-balance">
              {initialDenomValue.toConverted()} {getDenomInfo(initialDenom).name}
            </Text>
          </GridItem>
          <DestinationDetails strategy={strategy} />
        </Grid>
      </Box>
    </GridItem>
  );
}
