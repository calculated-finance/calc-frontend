import { Heading, Grid, GridItem, Box, Text, Divider, Badge, Flex, HStack, Tooltip } from '@chakra-ui/react';
import getDenomInfo, { DenomValue, getDenomName } from '@utils/getDenomInfo';

import { Strategy } from '@hooks/useStrategies';
import { StrategyTypes } from '@models/StrategyTypes';
import { DELEGATION_FEE, SWAP_FEE } from 'src/constants';
import { getPrettyFee } from '@helpers/getPrettyFee';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyType,
  getStrategyStartDate,
  isStrategyCancelled,
  getStrategyName,
  getSlippageTolerance,
  getPriceCeilingFloor,
  getConvertedSwapAmount,
  isStrategyAutoStaking,
  isBuyStrategy,
  getStrategyExecutionInterval,
} from '@helpers/strategy';
import { StrategyStatusBadge } from '@components/StrategyStatusBadge';

import { getEscrowAmount, getStrategySwapRange } from '@helpers/strategy/dcaPlus';
import { getChainDexName } from '@helpers/chains';
import { useChain } from '@hooks/useChain';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';

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
                <Text>
                  {getChainDexName(chain)} fee: {getPrettyFee(100, dexFee)}%
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

export function ReinvestStrategyDetails({ strategy }: { strategy: Strategy }) {
  const { time_interval, balance } = strategy;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const initialDenomValue = new DenomValue(balance);

  const strategyType = getStrategyType(strategy);

  const startDate = getStrategyStartDate(strategy);

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
        </Grid>
      </Box>
    </GridItem>
  );
}
