import 'isomorphic-fetch';
import { Box, Divider, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react';
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
import { formatFiat } from '../strategies/details/StrategyPerformance';

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

function Page() {
  const { data: contractBalances } = useAdminBalances(CONTRACT_ADDRESS);
  const { data: feeTakerBalances } = useAdminBalances(FEE_TAKER_ADDRESS);
  const { data: fiatPrices } = useFiatPrice(SUPPORTED_DENOMS[0]);

  const { data: allStrategies } = useAdminStrategies();

  const uniqueWalletAddresses = Array.from(new Set(allStrategies?.vaults.map((strategy) => strategy.owner) || []));

  if (!fiatPrices) {
    return null;
  }
  const totalInContract =
    contractBalances
      ?.map((balance, acc) => {
        const { conversion, coingeckoId } = getDenomInfo(balance.denom);
        const denomConvertedAmount = conversion(Number(balance.amount));
        const fiatAmount = denomConvertedAmount * fiatPrices[coingeckoId].usd;
        return fiatAmount;
      })
      .reduce((amount, total) => total + amount, 0) || 0;

  const totalInFeeTaker =
    feeTakerBalances
      ?.map((balance, acc) => {
        const { conversion, coingeckoId } = getDenomInfo(balance.denom);
        const denomConvertedAmount = conversion(Number(balance.amount));
        const fiatAmount = denomConvertedAmount * fiatPrices[coingeckoId].usd;
        return fiatAmount;
      })
      .reduce((amount, total) => total + amount, 0) || 0;
  return (
    <Stack spacing={6}>
      <Heading data-testid="details-heading">CALC statistics</Heading>
      <Stack spacing={4}>
        <Heading size="md">Unique wallets with strategies</Heading>
        <Text>Total: {uniqueWalletAddresses.length}</Text>
      </Stack>
      <Stack spacing={4}>
        <Heading size="md">Amount in contract</Heading>
        <Text>Total: {formatFiat(totalInContract)}</Text>
        <Box w={300}>
          <BalanceList balances={contractBalances} showFiat />
        </Box>
      </Stack>
      <Stack spacing={4}>
        <Heading size="md">Amount in Fee Taker</Heading>
        <Text>Total: {formatFiat(totalInFeeTaker)}</Text>
        <Box w={300}>
          <BalanceList balances={feeTakerBalances} showFiat />
        </Box>
      </Stack>
      <Stack spacing={4}>
        <Heading size="md">Strategy statistics</Heading>
        <Text>Total: {allStrategies?.vaults.length}</Text>
        <Heading size="sm">By Status</Heading>
        <Box w={300}>
          <StrategiesStatusList />
        </Box>
        <Heading size="sm">By Time Interval</Heading>
        <Box w={300}>
          <StrategiesTimeIntervalList />
        </Box>
      </Stack>
    </Stack>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
