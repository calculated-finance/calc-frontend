import React from 'react';
import { Text, Divider, GridItem, Grid } from '@chakra-ui/react';
import useBalances from '@hooks/useBalances';
import getDenomInfo from '@utils/getDenomInfo';
import { Coin } from '@cosmjs/stargate';
import useFiatPrice from '@hooks/useFiatPrice';
import { formatFiat } from '@helpers/format/formatFiat';

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
  const { price } = useFiatPrice(balance.denom);
  const { name, conversion } = getDenomInfo(balance.denom);
  const balanceConverted = conversion(Number(balance.amount));
  return (
    <>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          {balanceConverted}
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text textStyle="body-xs">{name || balance.denom}</Text>
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
        showFiat ? <CoinBalanceWithFiat balance={balance} /> : <CoinBalance balance={balance} />,
      )}
    </Grid>
  );
}

export function SpendableBalances() {
  const { data } = useBalances();

  return <BalanceList balances={data?.balances} />;
}
