import 'isomorphic-fetch';
import { Box, Divider, Grid, GridItem, Heading, SimpleGrid, Stack, Text, Wrap } from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';
import useAdminBalances from '@hooks/useAdminBalances';
import { BalanceList } from '@components/SpendableBalances';
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { CONTRACT_ADDRESS, FEE_TAKER_ADDRESS } from 'src/constants';
import useAdminStrategies from '@hooks/useAdminStrategies';
import { Strategy } from '@hooks/useStrategies';
import { VaultStatus } from 'src/interfaces/generated/query';
import { TimeInterval } from 'src/interfaces/generated/execute';
import { Coin } from '@cosmjs/stargate';
import { isAutoStaking, isStrategyAutoStaking } from 'src/helpers/isAutoStaking';
import { formatFiat } from '../strategies/details/StrategyPerformance';

function getTotalSwappedForDenom(denom: string, strategies: Strategy[]) {
  return strategies
    .filter((strategy) => strategy.swapped_amount.denom === denom)
    .map((strategy) => strategy.swapped_amount.amount)
    .reduce((total, amount) => total + Number(amount), 0)
    .toFixed(6);
}

function getTotalSwapped(strategies: Strategy[]) {
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

function StrategiesStatusItem({ status }: { status: Strategy['status'] }) {
  const { data: allStrategies } = useAdminStrategies();
  if (!allStrategies?.vaults.length) {
    return null;
  }
  if (allStrategies.vaults.length === 0) {
    return null;
  }
  const strategiesByStatus = allStrategies?.vaults.filter((strategy) => strategy.status === status) || [];
  const percentage = (Number(strategiesByStatus.length / allStrategies.vaults.length) * 100).toFixed(2);

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

function StrategiesTimeIntervalItem({ timeInterval }: { timeInterval: Strategy['time_interval'] }) {
  const { data: allStrategies } = useAdminStrategies();
  if (!allStrategies?.vaults.length) {
    return null;
  }
  if (allStrategies.vaults.length === 0) {
    return null;
  }
  const strategiesByTimeInterval =
    allStrategies?.vaults.filter((strategy) => strategy.time_interval === timeInterval) || [];
  const percentage = (Number(strategiesByTimeInterval.length / allStrategies.vaults.length) * 100).toFixed(2);

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
      {['hourly', 'daily', 'weekly', 'monthly'].map((timeInvertal: string) => (
        <StrategiesTimeIntervalItem timeInterval={timeInvertal as TimeInterval} />
      ))}
    </Grid>
  );
}

function totalFromCoins(coins: Coin[] | undefined, fiatPrices: any) {
  return (
    coins
      ?.map((balance, acc) => {
        const { conversion, coingeckoId } = getDenomInfo(balance.denom);
        const denomConvertedAmount = conversion(Number(balance.amount));
        const fiatAmount = denomConvertedAmount * fiatPrices[coingeckoId].usd;
        return fiatAmount;
      })
      .reduce((amount, total) => total + amount, 0) || 0
  );
}

function Page() {
  const { data: contractBalances } = useAdminBalances(CONTRACT_ADDRESS);
  const { data: feeTakerBalances } = useAdminBalances(FEE_TAKER_ADDRESS);
  const { data: fiatPrices } = useFiatPrice(SUPPORTED_DENOMS[0]);

  const { data: allStrategies } = useAdminStrategies();

  const uniqueWalletAddresses = Array.from(new Set(allStrategies?.vaults.map((strategy) => strategy.owner) || []));

  if (!fiatPrices || !allStrategies) {
    return null;
  }
  const totalInContract = totalFromCoins(contractBalances, fiatPrices);

  const totalInFeeTaker = totalFromCoins(feeTakerBalances, fiatPrices);

  const totalSwappedAmounts = getTotalSwapped(allStrategies?.vaults);
  const totalSwappedTotal = totalFromCoins(totalSwappedAmounts, fiatPrices);

  const totalReceivedAmounts = getTotalReceived(allStrategies?.vaults);
  const totalReceivedTotal = totalFromCoins(totalReceivedAmounts, fiatPrices);
  return (
    <Stack spacing={6}>
      <Heading data-testid="details-heading">CALC statistics</Heading>
      <SimpleGrid spacing={12} columns={[1, null, 2, null, 3]}>
        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Totals</Heading>
          <Heading size="sm" />
          <Text>Unique wallets with strategies: {uniqueWalletAddresses.length}</Text>
          <Text>Total strategies: {allStrategies?.vaults.length}</Text>
          <Text>
            Strategies per wallet: {((allStrategies?.vaults.length || 0) / uniqueWalletAddresses.length).toFixed(2)}
          </Text>
          <Text>Strategies with autostaking: {allStrategies?.vaults.filter(isStrategyAutoStaking).length}</Text>
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
          <Box w={300}>
            <StrategiesStatusList />
          </Box>
        </Stack>
        <Stack spacing={4} layerStyle="panel" p={4}>
          <Heading size="md">Strategies By Time Interval</Heading>
          <Box w={300}>
            <StrategiesTimeIntervalList />
          </Box>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
