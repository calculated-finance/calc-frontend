import { Text, Divider, GridItem, Grid, Stack } from '@chakra-ui/react';
import useBalances from '@hooks/useBalances';
import getDenomInfo, { convertDenomFromCoin } from '@utils/getDenomInfo';
import useFiatPrice from '@hooks/useFiatPrice';
import { formatFiat } from '@helpers/format/formatFiat';
import { Coin } from 'src/interfaces/v2/generated/response/get_vault';
import { useDenom } from '@hooks/useDenom/useDenom';
import { truncate } from '@helpers/truncate';

function CoinBalance({ balance }: { balance: Coin }) {
  const { name, conversion } = getDenomInfo(balance.denom);
  return (
    <>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          {conversion(Number(balance.amount))}
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Text textStyle="body-xs">{name || balance.denom}</Text>
      </GridItem>
    </>
  );
}

function CoinBalanceWithFiat({ balance }: { balance: Coin }) {
  const denom = useDenom(balance.denom);
  const { fiatPrice } = useFiatPrice(denom);
  const balanceConverted = convertDenomFromCoin(balance);
  return (
    <>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          {balanceConverted}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{denom.name || truncate(balance.denom)}</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{formatFiat((fiatPrice || 0) * balanceConverted)}</Text>
      </GridItem>
    </>
  );
}

export function BalanceList({ balances = [] }: { balances: Coin[] | undefined }) {
  return (
    <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          Balance
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">Asset</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">Fiat value</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Divider />
      </GridItem>
      {balances?.map((balance: Coin) => (
        <CoinBalanceWithFiat balance={balance} key={balance.denom} />
      ))}
    </Grid>
  );
}

export function SpendableBalances() {
  const { data: balances } = useBalances();

  return (
    <>
      <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem colSpan={1}>
          <Text fontSize="xs" noOfLines={1}>
            Balance
          </Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Text textStyle="body-xs" ml={4}>
            Asset
          </Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Divider />
        </GridItem>
      </Grid>
      <Stack overflow="auto" maxH={220}>
        <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
          {(balances as Coin[])?.map((balance: Coin) => (
            <CoinBalance balance={balance} key={balance.denom} />
          ))}
        </Grid>
      </Stack>
    </>
  );
}
