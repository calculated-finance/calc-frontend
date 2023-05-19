import { Box, HStack, Text, Divider, Stack, Grid, GridItem } from '@chakra-ui/react';
import YesNoValues from '@models/YesNoValues';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import { Chains, useChain } from '@hooks/useChain';
import usePrice from '@hooks/usePrice';
import usePriceOsmosis from '@hooks/usePriceOsmosis';
import { isNil } from 'lodash';
import { TransactionType } from './TransactionType';

const weights = [-0.5, -0.1, -0.05, -0.01, 0, 0.01, 0.05, 0.1, 0.5];

export function WeightsGrid({
  swapAmount,
  swapMultiplier,
  transactionType,
  applyMultiplier,
  basePrice,
  price,
  osmosisPrice,
}: {
  swapAmount: number;
  swapMultiplier: number;
  transactionType: TransactionType;
  applyMultiplier: YesNoValues;
  basePrice: number | null | undefined;
  price: string | undefined;
  osmosisPrice: string | undefined;
}) {
  const swapAmountSafe = swapAmount ?? 0;
  const calcSwapFromPriceDelta = (priceDelta: number) => {
    const weightDisabled =
      applyMultiplier === YesNoValues.No && (transactionType === TransactionType.Buy ? priceDelta > 0 : priceDelta < 0);
    const value = weightDisabled ? swapAmountSafe : swapAmountSafe * (1 - priceDelta * swapMultiplier);

    if (value < 0) {
      return 0;
    }
    if (value > 1000000000) {
      return `${Number((value / 1000000000).toFixed(2))}b`;
    }
    if (value > 1000000) {
      return `${Number((value / 1000000).toFixed(2))}m`;
    }
    if (value > 1000) {
      return `${Number((value / 1000).toFixed(2))}k`;
    }
    return Number(value.toFixed(2));
  };

  return (
    <Grid templateColumns="repeat(12, 1fr)" columnGap={2} rowGap={3}>
      <GridItem colSpan={3}>Price (USD) $</GridItem>
      {weights.map((weight) => {
        const displayPrice = basePrice || price || osmosisPrice;
        return (
          <GridItem colSpan={1} key={weight}>
            {(Number(displayPrice) + Number(displayPrice) * weight).toFixed(2)}
          </GridItem>
        );
      })}

      <GridItem colSpan={3}>Price Delta</GridItem>
      {weights.map((weight) => {
        const color = weight > 0 ? 'green.200' : weight < 0 ? 'red.200' : undefined;
        return (
          <GridItem colSpan={1} key={weight} color={color}>
            {formatSignedPercentage(weight, '')}
          </GridItem>
        );
      })}

      <GridItem colSpan={3}>Swap Amount:</GridItem>
      {weights.map((weight) => (
        <GridItem colSpan={1} key={weight}>
          {calcSwapFromPriceDelta(weight)}
        </GridItem>
      ))}
    </Grid>
  );
}

export function WeightSummary({
  swapAmount,
  swapMultiplier,
  transactionType,
  applyMultiplier,
  basePrice,
  initialDenom,
  resultingDenom,
}: {
  swapAmount: number;
  swapMultiplier: number;
  transactionType: TransactionType;
  applyMultiplier: YesNoValues;
  basePrice: number | null | undefined;
  initialDenom: Denom;
  resultingDenom: Denom;
}) {
  const { chain } = useChain();
  const { price } = usePrice(resultingDenom, initialDenom, transactionType, chain === Chains.Kujira);
  const { price: osmosisPrice } = usePriceOsmosis(
    resultingDenom,
    initialDenom,
    transactionType,
    chain === Chains.Osmosis,
  );

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = getDenomInfo(priceOfDenom);
  const { name: priceInDenomName } = getDenomInfo(priceInDenom);

  return (
    <Box fontSize="10px" bg="abyss.200" p={4} borderRadius="md" color="white">
      <Stack spacing={3}>
        <HStack justify="space-between">
          <Text>Base Swap: {swapAmount || 0} axlUSDC</Text>
          <Text>|</Text>
          <Text>Multiplier: {swapMultiplier}</Text>
          <Text>|</Text>
          <Text>
            Base Price:{' '}
            <Text as="span" color="blue.200">
              {`1 ${priceOfDenomName} = ${isNil(basePrice) ? price || osmosisPrice : basePrice} ${priceInDenomName}`}
            </Text>
          </Text>
        </HStack>
        <Divider borderWidth={1} />
        <WeightsGrid
          swapAmount={swapAmount}
          swapMultiplier={swapMultiplier}
          transactionType={transactionType}
          applyMultiplier={applyMultiplier}
          basePrice={basePrice}
          price={price}
          osmosisPrice={osmosisPrice}
        />
      </Stack>
    </Box>
  );
}
