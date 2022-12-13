import 'isomorphic-fetch';
import { Box, Divider, Grid, GridItem, Heading, SimpleGrid, Stack, Text, Wrap } from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';
import useAdminBalances from '@hooks/useAdminBalances';
import { BalanceList } from '@components/SpendableBalances';
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { CONTRACT_ADDRESS, FEE_TAKER_ADDRESS, SWAP_FEE } from 'src/constants';
import useAdminStrategies from '@hooks/useAdminStrategies';
import { Strategy } from '@hooks/useStrategies';
import { VaultStatus } from 'src/interfaces/generated/query';
import { TimeInterval } from 'src/interfaces/generated/execute';
import { Coin } from '@cosmjs/stargate';
import { isAutoStaking, isStrategyAutoStaking } from 'src/helpers/isAutoStaking';
import { getStrategyEndDate } from 'src/helpers/getStrategyEndDate';
import { getEndDateFromRemainingExecutions } from 'src/helpers/getEndDateFromRemainingExecutions';
import { isStrategyActive } from 'src/helpers/getStrategyStatus';
import { VaultsResponse } from 'src/interfaces/generated/response/get_vaults_by_address';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryGroup,
  VictoryHistogram,
  VictoryLabel,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { StrategyTypes } from '@models/StrategyTypes';
import { getStrategyType } from 'src/helpers/getStrategyType';
import { formatFiat } from '../strategies/details/StrategyPerformance';
import { getStrategyTotalExecutions } from '../create-strategy/dca-in/success/getStrategyTotalExecutions';

function getTotalSwappedForDenom(denom: string, strategies: Strategy[]) {
  return strategies
    .filter((strategy) => strategy.swapped_amount.denom === denom)
    .map((strategy) => strategy.swapped_amount.amount)
    .reduce((total, amount) => total + Number(amount), 0)
    .toFixed(6);
}

export function getTotalSwapped(strategies: Strategy[]) {
  const totalSwapped = SUPPORTED_DENOMS.map(
    (denom) =>
      ({
        denom,
        amount: getTotalSwappedForDenom(denom, strategies),
      } as Coin),
  );

  return totalSwapped;
}

function getTotalReceivedForDenom(denom: string, strategies: Strategy[]) {
  return strategies
    .filter((strategy) => strategy.received_amount.denom === denom)
    .map((strategy) => strategy.received_amount.amount)
    .reduce((total, amount) => total + Number(amount), 0)
    .toFixed(6);
}

function getTotalReceived(strategies: Strategy[]) {
  const totalSwapped = SUPPORTED_DENOMS.map(
    (denom) =>
      ({
        denom,
        amount: getTotalReceivedForDenom(denom, strategies),
      } as Coin),
  );

  return totalSwapped;
}

function getStrategiesByStatus(allStrategies: Strategy[], status: string) {
  const strategiesByStatus = allStrategies.filter((strategy) => strategy.status === status) || [];
  const percentage = (Number(strategiesByStatus.length / allStrategies.length) * 100).toFixed(2);
  return { strategiesByStatus, percentage };
}

function StrategiesStatusItem({ status }: { status: Strategy['status'] }) {
  const { data: allStrategies } = useAdminStrategies();
  if (!allStrategies?.vaults.length) {
    return null;
  }
  if (allStrategies.vaults.length === 0) {
    return null;
  }
  const { strategiesByStatus, percentage } = getStrategiesByStatus(allStrategies.vaults, status);

  return (
    <>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1} textTransform="capitalize">
          {status}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs"> {strategiesByStatus.length}</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{percentage}%</Text>
      </GridItem>
    </>
  );
}

function getStrategiesByTimeInterval(allStrategies: Strategy[], timeInterval: string) {
  const strategiesByTimeInterval = allStrategies.filter((strategy) => strategy.time_interval === timeInterval) || [];
  const percentage = (Number(strategiesByTimeInterval.length / allStrategies.length) * 100).toFixed(2);
  return { strategiesByTimeInterval, percentage };
}

function getStrategiesByType(allStrategies: Strategy[], type: StrategyTypes) {
  const strategiesByType = allStrategies.filter((strategy) => getStrategyType(strategy) === type) || [];
  const percentage = (Number(strategiesByType.length / allStrategies.length) * 100).toFixed(2);
  return { strategiesByType, percentage };
}

function StrategiesTimeIntervalItem({ timeInterval }: { timeInterval: Strategy['time_interval'] }) {
  const { data: allStrategies } = useAdminStrategies();
  if (!allStrategies?.vaults.length) {
    return null;
  }
  if (allStrategies.vaults.length === 0) {
    return null;
  }
  const { strategiesByTimeInterval, percentage } = getStrategiesByTimeInterval(allStrategies.vaults, timeInterval);

  return (
    <>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1} textTransform="capitalize">
          {timeInterval}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs"> {strategiesByTimeInterval.length}</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{percentage}%</Text>
      </GridItem>
    </>
  );
}

function StrategiesStatusList() {
  return (
    <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          Status
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">Count</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">Percentage</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Divider />
      </GridItem>
      {['scheduled', 'active', 'inactive', 'cancelled'].map((status: string) => (
        <StrategiesStatusItem status={status as VaultStatus} />
      ))}
    </Grid>
  );
}

function StrategiesTimeIntervalList() {
  return (
    <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          Status
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">Count</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">Percentage</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Divider />
      </GridItem>
      {['hourly', 'daily', 'weekly', 'monthly'].map((timeInterval: string) => (
        <StrategiesTimeIntervalItem timeInterval={timeInterval as TimeInterval} />
      ))}
    </Grid>
  );
}

export function totalFromCoins(coins: Coin[] | undefined, fiatPrices: any) {
  return (
    coins
      ?.filter((coin) => SUPPORTED_DENOMS.includes(coin.denom))
      .map((balance, acc) => {
        const { conversion, coingeckoId } = getDenomInfo(balance.denom);
        const denomConvertedAmount = conversion(Number(balance.amount));
        const fiatAmount = denomConvertedAmount * fiatPrices[coingeckoId].usd;
        return fiatAmount;
      })
      .reduce((amount, total) => total + amount, 0) || 0
  );
}

function daysUntil(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
}

function weeksUntil(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24 * 7));
}

function monthsUntil(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24 * 30));
}

function hoursUntil(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600));
}

// map functions to time intervals
const timeIntervalMap = {
  half_hourly: () => 30,
  hourly: hoursUntil,
  half_daily: () => 12,
  daily: daysUntil,
  weekly: weeksUntil,
  fortnightly: () => 2,
  monthly: monthsUntil,
};

function getSwapCountForStrategyUntilDate(strategy: Strategy, date: Date) {
  return Math.min(timeIntervalMap[strategy.time_interval](date), getStrategyTotalExecutions(strategy));
}

function getFeesPerSwapForStrategy(strategy: Strategy) {
  const fees = SWAP_FEE * Number(strategy.swap_amount);
  const { conversion } = getDenomInfo(strategy.balance.denom);
  const convertedFees = conversion(fees);

  return convertedFees;
}

function getFeesUntilDate(strategy: Strategy, date: Date) {
  const swapCount = getSwapCountForStrategyUntilDate(strategy, date);
  return getFeesPerSwapForStrategy(strategy) * swapCount;
}

function getFiatPriceFromList(fiatPrices: any, denom: string) {
  const { coingeckoId } = getDenomInfo(denom);
  return fiatPrices[coingeckoId].usd;
}

function getProjectedRevenueForStrategyForDate(strategy: Strategy, date: Date, fiatPrices: any) {
  const fees = getFeesUntilDate(strategy, date);
  const fiatPrice = getFiatPriceFromList(fiatPrices, strategy.balance.denom);
  return fees * fiatPrice;
}

function getProjectedRevenueForStrategysForDate(strategies: Strategy[], date: Date, fiatPrices: any) {
  return strategies
    .map((strategy) => getProjectedRevenueForStrategyForDate(strategy, date, fiatPrices))
    .reduce((amount, total) => total + amount, 0);
}

function timeUntilEndOfStrategyInMilliseconds(strategy: Strategy) {
  const now = new Date();
  const now2 = new Date();
  const end = getEndDateFromRemainingExecutions(strategy, now2, getStrategyTotalExecutions(strategy));
  if (!end) return 0;
  const diff = end.getTime() - now.getTime();
  return diff;
}

function getMaxDurationInMilliseconds(strategies: Strategy[]) {
  return Math.max(...strategies.map((strategy) => timeUntilEndOfStrategyInMilliseconds(strategy)));
}

function getAverageDurationForActiveStrategies(strategies: Strategy[]) {
  const totalDuration = strategies
    .filter(isStrategyActive)
    .map((strategy) => timeUntilEndOfStrategyInMilliseconds(strategy))
    .reduce((amount, total) => total + amount, 0);
  return totalDuration / strategies.length;
}
export function uniqueAddresses(allStrategies: VaultsResponse | undefined) {
  return Array.from(new Set(allStrategies?.vaults.map((strategy) => strategy.owner) || []));
}

function Page() {
  const { balances: contractBalances } = useAdminBalances(CONTRACT_ADDRESS);
  const { balances: feeTakerBalances } = useAdminBalances(FEE_TAKER_ADDRESS);
  const { data: fiatPrices } = useFiatPrice(SUPPORTED_DENOMS[0]);

  const { data: allStrategies } = useAdminStrategies();

  const uniqueWalletAddresses = uniqueAddresses(allStrategies);

  if (!fiatPrices || !allStrategies) {
    return null;
  }
  const totalInContract = totalFromCoins(contractBalances, fiatPrices);

  const totalInFeeTaker = totalFromCoins(feeTakerBalances, fiatPrices);

  const totalSwappedAmounts = getTotalSwapped(allStrategies?.vaults);
  const totalSwappedTotal = totalFromCoins(totalSwappedAmounts, fiatPrices);

  const totalReceivedAmounts = getTotalReceived(allStrategies?.vaults);
  const totalReceivedTotal = totalFromCoins(totalReceivedAmounts, fiatPrices);


  const ThirtyDaysFromNow = new Date();
  ThirtyDaysFromNow.setDate(ThirtyDaysFromNow.getDate() + 30);

  const ThreeMonthsFromNow = new Date();
  ThreeMonthsFromNow.setDate(ThreeMonthsFromNow.getDate() + 90);

  const AYearFromNow = new Date();
  AYearFromNow.setDate(AYearFromNow.getDate() + 365);

  const thirtDayRevenue = getProjectedRevenueForStrategysForDate(allStrategies?.vaults, ThirtyDaysFromNow, fiatPrices);
  const threeMonthRevenue = getProjectedRevenueForStrategysForDate(
    allStrategies?.vaults,
    ThreeMonthsFromNow,
    fiatPrices,
  );
  const twelveMonthRevenue = getProjectedRevenueForStrategysForDate(allStrategies?.vaults, AYearFromNow, fiatPrices);
  const averageDuration = getAverageDurationForActiveStrategies(allStrategies?.vaults);
  const averageDurationInDays = Math.floor(averageDuration / (1000 * 60 * 60 * 24));

  const maxDurationInDays = getMaxDurationInMilliseconds(allStrategies?.vaults) / (1000 * 60 * 60 * 24);

  return (
    <Stack spacing={6}>
      <Heading data-testid="details-heading">CALC statistics</Heading>
      <SimpleGrid spacing={12} columns={[1, null, 2, null, 3]}>
        <Stack spacing={2} layerStyle="panel" p={4}>
          <Heading size="md">Totals</Heading>
          <Heading size="sm" />
          <Text>Unique wallets with strategies: {uniqueWalletAddresses.length}</Text>
          <Text>Total strategies: {allStrategies?.vaults.length}</Text>
          <Text textStyle="body-xs">
            Strategies per wallet: {((allStrategies?.vaults.length || 0) / uniqueWalletAddresses.length).toFixed(2)}
          </Text>
          <Text textStyle="body-xs">
            Strategies with autostaking: {allStrategies?.vaults.filter(isStrategyAutoStaking).length}
          </Text>
          <Text textStyle="body-xs">
            Average Time Until End of Strategy: {averageDurationInDays} days (Max: {maxDurationInDays} days)
          </Text>
        </Stack>

        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Amount in contract</Heading>
          <Text>Total: {formatFiat(totalInContract)}</Text>
          <Box w={300}>
            <BalanceList balances={contractBalances} showFiat />
          </Box>
        </Stack>
        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Amount in Fee Taker</Heading>
          <Text>Total: {formatFiat(totalInFeeTaker)}</Text>
          <Box w={300}>
            <BalanceList balances={feeTakerBalances} showFiat />
          </Box>
        </Stack>
        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Projected revenue (30 Days)</Heading>
          <Text textStyle="body-xs">Based on expected executions and swap amounts </Text>
          <SimpleGrid columns={2} spacing={4} textStyle="bod">
            <Text> 30 Days: </Text>
            <Text>{formatFiat(thirtDayRevenue)}</Text>
            <Text> 3 Months: </Text>
            <Text>{formatFiat(threeMonthRevenue)}</Text>
            <Text> 1 Year: </Text>
            <Text>{formatFiat(twelveMonthRevenue)}</Text>
          </SimpleGrid>
        </Stack>

        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Amount Swapped</Heading>
          <Text>Total: {formatFiat(totalSwappedTotal)}</Text>
          <Box w={300}>
            <BalanceList balances={totalSwappedAmounts} showFiat />
          </Box>
        </Stack>
        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Amount Received</Heading>
          <Text>Total: {formatFiat(totalReceivedTotal)}</Text>
          <Box w={300}>
            <BalanceList balances={totalReceivedAmounts} showFiat />
          </Box>
        </Stack>

        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Strategies By Status</Heading>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryBar
              data={['scheduled', 'active', 'inactive', 'cancelled'].map((timeInterval: string) => {
                const { strategiesByStatus } = getStrategiesByStatus(allStrategies?.vaults || [], timeInterval) || [];

                return {
                  x: timeInterval,
                  y: strategiesByStatus.length,
                  label: `${timeInterval} \n(${strategiesByStatus.length})`,
                };
              })}
              colorScale={['tomato', 'orange', 'gold', 'cyan']}
              style={{
                labels: {
                  fill: 'white',
                },
              }}
            />
          </VictoryChart>
        </Stack>
        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Strategies By Time Interval</Heading>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={['hourly', 'daily', 'weekly', 'monthly'].map((timeInterval: string) => {
                const { strategiesByTimeInterval, percentage } =
                  getStrategiesByTimeInterval(allStrategies?.vaults || [], timeInterval) || [];

                return {
                  x: timeInterval,
                  y: strategiesByTimeInterval.length,
                  label: `${percentage}%`,
                };
              })}
              colorScale={['tomato', 'orange', 'gold', 'cyan']}
              style={{
                labels: {
                  fill: 'white',
                },
              }}
            />
          </VictoryChart>
        </Stack>

        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Strategies By Type</Heading>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={[StrategyTypes.DCAIn, StrategyTypes.DCAOut].map((type: StrategyTypes) => {
                const { strategiesByType, percentage } = getStrategiesByType(allStrategies?.vaults || [], type) || [];

                return {
                  x: type,
                  y: strategiesByType.length,
                  label: `${percentage}%`,
                };
              })}
              colorScale={['tomato', 'orange', 'gold', 'cyan']}
              style={{
                labels: {
                  fill: 'white',
                },
              }}
            />
          </VictoryChart>
        </Stack>

        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Active Strategies By Remaining Days</Heading>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryAxis
              tickFormat={(tick) => `${tick}`}
              style={{
                grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
              }}
            />
            <VictoryHistogram
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              bins={20}
              data={allStrategies.vaults.filter(isStrategyActive).map((strategy: Strategy) => {
                const remainingTime = timeUntilEndOfStrategyInMilliseconds(strategy);
                const remainingTimeInDays = Math.round(remainingTime / (1000 * 60 * 60 * 24));
                return {
                  x: remainingTimeInDays,
                  label: remainingTimeInDays,
                };
              })}
              labelComponent={<VictoryTooltip />}
              colorScale={['tomato', 'orange', 'gold', 'cyan']}
              style={{
                labels: {
                  fill: 'white',
                },
              }}
            />
          </VictoryChart>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
