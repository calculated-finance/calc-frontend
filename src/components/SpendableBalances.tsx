import React from 'react';
import { Text, Divider, GridItem, Grid } from '@chakra-ui/react';
import useBalances from '@hooks/useBalances';
import getDenomInfo, { convertDenomFromCoin } from '@utils/getDenomInfo';
import useFiatPrice from '@hooks/useFiatPrice';
import { formatFiat } from '@helpers/format/formatFiat';
import { Coin } from 'src/interfaces/v2/generated/response/get_vault';
import { useDenom } from '@hooks/useDenom/useDenom';

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
  const { price } = useFiatPrice(denom);
  const balanceConverted = convertDenomFromCoin(balance);
  return (
    <>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          {balanceConverted}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{denom.name || balance.denom}</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{formatFiat(price * balanceConverted)}</Text>
      </GridItem>
    </>
  );
}

export function BalanceList({ balances = [], showFiat = false }: { balances: Coin[] | undefined; showFiat?: boolean }) {
  return (
    <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          Balance
        </Text>
      </GridItem>
      <GridItem colSpan={showFiat ? 1 : 2}>
        <Text textStyle="body-xs">Asset</Text>
      </GridItem>
      {showFiat && (
        <GridItem colSpan={1}>
          <Text textStyle="body-xs">Fiat value</Text>
        </GridItem>
      )}
      <GridItem colSpan={3}>
        <Divider />
      </GridItem>
      {balances?.map((balance: Coin) =>
        showFiat ? (
          <CoinBalanceWithFiat balance={balance} key={balance.denom} />
        ) : (
          <CoinBalance balance={balance} key={balance.denom} />
        ),
      )}
    </Grid>
  );
}

export function SpendableBalances() {
  const { data } = useBalances();

  return <BalanceList balances={data?.balances} />;
}
