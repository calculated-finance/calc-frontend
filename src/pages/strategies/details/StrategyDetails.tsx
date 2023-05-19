import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Heading,
  Grid,
  GridItem,
  Box,
  Text,
  Divider,
  Badge,
  Flex,
  Button,
  HStack,
  Tooltip,
  Stack,
} from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import getDenomInfo, { DenomValue, getDenomName } from '@utils/getDenomInfo';
import Link from 'next/link';
import { generateStrategyTopUpUrl } from '@components/TopPanel/generateStrategyTopUpUrl';

import { Strategy } from '@hooks/useStrategies';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { StrategyTypes } from '@models/StrategyTypes';
import { DELEGATION_FEE, SWAP_FEE, SWAP_FEE_WS } from 'src/constants';
import { getPrettyFee } from '@helpers/getPrettyFee';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyType,
  getStrategyStartDate,
  isStrategyCancelled,
  getStrategyName,
  getStrategyEndDate,
  getSlippageTolerance,
  getPriceCeilingFloor,
  getConvertedSwapAmount,
  isStrategyAutoStaking,
  isStrategyOperating,
  isBuyStrategy,
  getStrategyExecutionInterval,
  getBasePrice,
} from '@helpers/strategy';
import { StrategyStatusBadge } from '@components/StrategyStatusBadge';

import { getEscrowAmount, getStrategyEndDateRange, getStrategySwapRange } from '@helpers/strategy/dcaPlus';
import { Chains, useChain } from '@hooks/useChain';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { isNil } from 'lodash';
import { getWeightedScaleConfig, isWeightedScale } from '@helpers/strategy/isWeightedScale';
import { WeightSummary } from '@components/WeightSummary';
import YesNoValues from '@models/YesNoValues';
import { CancelButton } from './CancelButton';
import { DestinationDetails } from './DestinationDetails';

function Escrowed({ strategy }: { strategy: Strategy }) {
  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">
          {' '}
          <Tooltip
            label={
              <Text>
                A maximum of 5% swap volume, this amount with be returned in full if DCA+ does not outperform
                traditional DCA at the end of the strategy.
              </Text>
            }
          >
            Escrowed*
          </Tooltip>
        </Heading>
      </GridItem>
      <GridItem colSpan={2}>
        <Text fontSize="sm" data-testid="strategy-escrow-amount">
          {getEscrowAmount(strategy)} {getDenomName(getStrategyResultingDenom(strategy))}
        </Text>
      </GridItem>
    </>
  );
}

export function SwapEachCycle({ strategy }: { strategy: Strategy }) {
  const { min, max } = getStrategySwapRange(strategy) || {};
  const { chain } = useChain();
  const { dexFee } = useDexFee(
    getStrategyInitialDenom(strategy),
    getStrategyResultingDenom(strategy),
    isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell,
  );

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Swap each cycle </Heading>
      </GridItem>
      <GridItem colSpan={2}>
        <Text fontSize="sm" data-testid="strategy-swap-amount">
          {!isNil(min) && !isNil(max) ? (
            <>
              Between {min} and {max} {getDenomName(getStrategyInitialDenom(strategy))}
            </>
          ) : (
            <>
              {getConvertedSwapAmount(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
            </>
          )}{' '}
          -{' '}
          <Tooltip
            label={
              <Box>
                <Text>Fees automatically deducted from each swap:</Text>
                {!isDcaPlus(strategy) && !isWeightedScale(strategy) ? (
                  <Text>CALC sustainability fee: {getPrettyFee(100, SWAP_FEE)}%</Text>
                ) : (
                  isWeightedScale(strategy) && <Text>CALC sustainability fee: {getPrettyFee(100, SWAP_FEE_WS)}%</Text>
                )}
                <Text>
                  {chain === Chains.Osmosis ? 'Osmosis swap' : 'Kujira'} fee: {getPrettyFee(100, dexFee)}%
                </Text>
                {isStrategyAutoStaking(strategy) && <Text>Automation fee: {getPrettyFee(100, DELEGATION_FEE)}%</Text>}
              </Box>
            }
          >
            fees*
          </Tooltip>
        </Text>
      </GridItem>
    </>
  );
}

export default function StrategyDetails({ strategy }: { strategy: Strategy }) {
  const { balance, destinations } = strategy;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const initialDenomValue = new DenomValue(balance);

  const strategyType = getStrategyType(strategy);

  const startDate = getStrategyStartDate(strategy);

  const { data: events } = useStrategyEvents(strategy.id);

  return (
    <GridItem colSpan={[6, null, null, null, 3]}>
      <Stack spacing={6}>
        <Box>
          <Heading pb={4} size="md">
            Strategy details
          </Heading>
          <Box px={8} py={6} layerStyle="panel">
            <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center">
              <GridItem colSpan={1}>
                <Heading size="xs">Strategy status</Heading>
              </GridItem>
              <GridItem colSpan={1} data-testid="strategy-status">
                <StrategyStatusBadge strategy={strategy} />
              </GridItem>
              <GridItem colSpan={1} visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}>
                <Flex justifyContent="end">
                  <CancelButton strategy={strategy} />
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="xs">Strategy name</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize="sm" data-testid="strategy-name">
                  {getStrategyName(strategy)}
                </Text>
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
                <Heading size="xs">Estimated strategy end date</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize="sm" data-testid="estimated-strategy-end-date">
                  {(isDcaPlus(strategy) || isWeightedScale(strategy)) && isStrategyOperating(strategy) ? (
                    <>
                      Between {getStrategyEndDateRange(strategy, events).min} and{' '}
                      {getStrategyEndDateRange(strategy, events).max}
                    </>
                  ) : (
                    getStrategyEndDate(strategy, events)
                  )}
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
              <SwapEachCycle strategy={strategy} />
              {isDcaPlus(strategy) && <Escrowed strategy={strategy} />}
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
                    <Heading size="xs">
                      {strategyType === StrategyTypes.DCAIn ? 'Price ceiling' : 'Price floor'}
                    </Heading>
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
              <GridItem colSpan={1}>
                <Text fontSize="sm" data-testid="strategy-current-balance">
                  {initialDenomValue.toConverted()} {getDenomInfo(initialDenom).name}
                </Text>
              </GridItem>
              <GridItem visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}>
                <Flex justify="end">
                  <Link href={generateStrategyTopUpUrl(strategy.id)}>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="brand"
                      leftIcon={<CalcIcon as={PlusSquareIcon} stroke="brand.200" width={4} height={4} />}
                    >
                      Add more funds
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
              {Boolean(destinations.length) && <DestinationDetails strategy={strategy} />}
            </Grid>
          </Box>
        </Box>
        <Box>
          <Heading pb={4} size="md">
            Swap multiplier
          </Heading>
          <Box px={3} py={2} layerStyle="panel">
            <WeightSummary
              swapAmount={getConvertedSwapAmount(strategy)}
              swapMultiplier={Number(getWeightedScaleConfig(strategy)?.multiplier)}
              transactionType={isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell}
              applyMultiplier={getWeightedScaleConfig(strategy)?.increase_only ? YesNoValues.No : YesNoValues.Yes}
              basePrice={getBasePrice(strategy)}
            />
          </Box>
        </Box>
      </Stack>
    </GridItem>
  );
}
