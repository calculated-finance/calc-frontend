import { Box, HStack, Text, Divider, Stack, Grid, GridItem, Tooltip, Spinner } from '@chakra-ui/react';
import YesNoValues from '@models/YesNoValues';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import useSpotPrice from '@hooks/useSpotPrice';
import { isNil } from 'lodash';
import { DenomInfo } from '@utils/DenomInfo';
import { fromAtomic } from '@utils/getDenomInfo';
import { TransactionType } from './TransactionType';

const weights = [-0.5, -0.1, -0.05, -0.01, 0, 0.01, 0.05, 0.1, 0.5];

function convertLargeNumber(value: number) {
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
}

export function WeightsGrid({
  swapAmount,
  swapMultiplier,
  transactionType,
  applyMultiplier,
  basePrice,
  price,
  priceThresholdValue,
  initialDenom,
  resultingDenom,
}: {
  swapAmount: number;
  swapMultiplier: number;
  transactionType: TransactionType;
  applyMultiplier: YesNoValues;
  basePrice: number | null | undefined;
  price: number | undefined;
  priceThresholdValue: number | undefined | null;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
}) {
  const swapAmountSafe = fromAtomic(initialDenom, swapAmount ?? 0);

  const calcSwapFromPriceDelta = (priceDelta: number) => {
    const weightDisabled =
      applyMultiplier === YesNoValues.No && (transactionType === TransactionType.Buy ? priceDelta > 0 : priceDelta < 0);

    const buySellPriceDelta = transactionType === TransactionType.Buy ? priceDelta : -priceDelta;
    const value = weightDisabled ? swapAmountSafe : swapAmountSafe * (1 - buySellPriceDelta * swapMultiplier);

    return value < 0 ? 0 : convertLargeNumber(value);
  };

  return (
    <Grid templateColumns="repeat(12, 1fr)" columnGap={2} rowGap={3}>
      <GridItem colSpan={3}>
        Price ({transactionType === 'buy' ? initialDenom.name : transactionType === 'sell' && resultingDenom.name}) $
      </GridItem>
      {weights.map((weight) => {
        const displayPrice = basePrice || price;
        const calcPrice = displayPrice && Number(displayPrice) + Number(displayPrice) * weight;
        if (calcPrice) {
          return (
            <Tooltip label={`$${calcPrice.toFixed(4)}`}>
              <GridItem colSpan={1} key={weight}>
                {convertLargeNumber(calcPrice)}
              </GridItem>
            </Tooltip>
          );
        }
        return <Spinner size="xs" />;
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
      <GridItem colSpan={3}>
        {priceThresholdValue ? (
          <Tooltip label="Setting a price floor/ceiling may affect your swap amounts.">Swap Amount: *</Tooltip>
        ) : (
          <Text>Swap Amount:</Text>
        )}
      </GridItem>
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
  route,
  priceThresholdValue,
}: {
  swapAmount: number;
  swapMultiplier: number;
  transactionType: TransactionType;
  applyMultiplier: YesNoValues;
  basePrice: number | null | undefined;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  route: string | null | undefined;
  priceThresholdValue: number | undefined | null;
}) {
  const { spotPrice: price, formattedPrice } = useSpotPrice(resultingDenom, initialDenom, transactionType, route);

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = priceOfDenom;
  const { name: priceInDenomName } = priceInDenom;

  return (
    <Box fontSize="10px" bg="deepHorizon" p={4} borderRadius="md" color="white">
      <Stack spacing={3}>
        <HStack justify="space-between">
          <Text>
            Base Swap: {swapAmount || 0} {initialDenom.name}
          </Text>
          <Text>|</Text>
          <Text>Multiplier: {swapMultiplier}</Text>
          <Text>|</Text>
          <Text>
            Base Price:{' '}
            <Text as="span" color="blue.200">
              {`1 ${priceOfDenomName} = ${isNil(basePrice) ? formattedPrice : basePrice} ${priceInDenomName}`}
            </Text>
          </Text>
        </HStack>
        <Divider borderWidth={1} />
        <WeightsGrid
          resultingDenom={resultingDenom}
          initialDenom={initialDenom}
          swapAmount={swapAmount}
          swapMultiplier={swapMultiplier}
          transactionType={transactionType}
          applyMultiplier={applyMultiplier}
          basePrice={basePrice}
          price={price}
          priceThresholdValue={priceThresholdValue}
        />
      </Stack>
    </Box>
  );
}
