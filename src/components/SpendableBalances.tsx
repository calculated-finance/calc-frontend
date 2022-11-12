import React from 'react';
import { Text, Divider, GridItem, Grid } from '@chakra-ui/react';
import useBalances from '@hooks/useBalances';
import getDenomInfo from '@utils/getDenomInfo';
import { Coin } from '@cosmjs/stargate';

export function SpendableBalances() {
  const { data } = useBalances();

  return (
    <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          Balance
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Text textStyle="body-xs">Asset</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Divider />
      </GridItem>
      {data?.balances.map((balance: Coin) => {
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
      })}
    </Grid>
  );
}
