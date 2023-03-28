import { PlusSquareIcon } from '@chakra-ui/icons';
import { Heading, Grid, GridItem, Box, Text, Divider, Badge, Flex, Button, HStack, Tooltip } from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import Spinner from '@components/Spinner';
import getDenomInfo, { DenomValue, getDenomName } from '@utils/getDenomInfo';
import Link from 'next/link';
import { generateStrategyTopUpUrl } from '@components/TopPanel/generateStrategyTopUpUrl';

import { Strategy } from '@hooks/useStrategies';
import { useWallet } from '@wizard-ui/react';
import useValidator from '@hooks/useValidator';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { StrategyTypes } from '@models/StrategyTypes';
import { DELEGATION_FEE, FIN_TAKER_FEE, SWAP_FEE } from 'src/constants';
import { isAutoStaking } from '@helpers/isAutoStaking';
import { getPrettyFee } from '@helpers/getPrettyFee';
import { executionIntervalLabel } from '@helpers/executionIntervalDisplay';
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
  isDcaPlus,
  isStrategyOperating,
} from '@helpers/strategy';
import { StrategyStatusBadge } from '@components/StrategyStatusBadge';

import { getEscrowAmount, getStrategyEndDateRange, getStrategySwapRange } from '@helpers/strategy/dcaPlus';
import { CancelButton } from './CancelButton';

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

function SwapEachCycle({ strategy }: { strategy: Strategy }) {
  const { min, max } = getStrategySwapRange(strategy) || {};
  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Swap each cycle </Heading>
      </GridItem>
      <GridItem colSpan={2}>
        <Text fontSize="sm" data-testid="strategy-swap-amount">
          {isDcaPlus(strategy) ? (
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
                {!isDcaPlus(strategy) && <Text>CALC sustainability fee: {getPrettyFee(100, SWAP_FEE)}%</Text>}
                <Text>FIN taker fee: {getPrettyFee(100, FIN_TAKER_FEE)}%</Text>
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
  const { address } = useWallet();
  const { validator, isLoading } = useValidator(strategy.destinations[0].address);

  const { time_interval, balance, destinations } = strategy;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const initialDenomValue = new DenomValue(balance);

  const strategyType = getStrategyType(strategy);

  const startDate = getStrategyStartDate(strategy);

  const { data: eventsData } = useStrategyEvents(strategy.id);
  const events = eventsData?.events;

  return (
    <GridItem colSpan={[6, null, null, null, 3]}>
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
              {isDcaPlus(strategy) && isStrategyOperating(strategy) ? (
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
              {executionIntervalLabel[time_interval]}
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
          {Boolean(destinations.length) &&
            (isAutoStaking(destinations) ? (
              <>
                <GridItem colSpan={1}>
                  <Heading size="xs">Auto staking status</Heading>
                </GridItem>
                <GridItem colSpan={2} data-testid="strategy-auto-staking-status">
                  <Badge colorScheme="green">Active</Badge>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Validator name</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm" data-testid="strategy-validator-name">
                    {isLoading ? <Spinner /> : validator?.description?.moniker}
                  </Text>
                </GridItem>
              </>
            ) : (
              destinations[0].address !== address && (
                <>
                  <GridItem colSpan={1}>
                    <Heading size="xs">Sending to </Heading>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text fontSize="sm" data-testid="strategy-receiving-address">
                      {destinations[0].address}
                    </Text>
                  </GridItem>
                </>
              )
            ))}
        </Grid>
      </Box>
    </GridItem>
  );
}
