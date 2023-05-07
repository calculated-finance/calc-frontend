import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  Divider,
  Grid,
  GridItem,
  Stack,
  Code,
  Tooltip,
} from '@chakra-ui/react';
import { formatSignedPercentage } from '@helpers/format/formatSignedPercentage';
import { Denom } from '@models/Denom';
import YesNoValues from '@models/YesNoValues';
import { getDenomName } from '@utils/getDenomInfo';
import { useField } from 'formik';
import { TransactionType } from './TransactionType';

const weights = [-0.5, -0.1, -0.05, -0.01, 0, 0.01, 0.05, 0.1, 0.5];

function WeightsGrid({
  swapAmount,
  swapMultiplier,
  transactionType,
}: {
  swapAmount: number;
  swapMultiplier: number;
  transactionType: TransactionType;
}) {
  const [{ value: applyMultiplier }] = useField({ name: 'applyMultiplier' });

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
      <GridItem colSpan={3}>Price Delta</GridItem>
      {weights.map((weight) => {
        const color = weight > 0 ? 'green.200' : weight < 0 ? 'red.200' : undefined;
        return (
          <GridItem colSpan={1} key={weight} color={color}>
            {formatSignedPercentage(weight, '')}
          </GridItem>
        );
      })}

      <GridItem colSpan={3}>Buy amount:</GridItem>
      {weights.map((weight) => (
        <GridItem colSpan={1} key={weight}>
          {calcSwapFromPriceDelta(weight)}
        </GridItem>
      ))}
    </Grid>
  );
}

export default function SwapMultiplier({
  initialDenom,
  transactionType,
}: {
  initialDenom: Denom;
  transactionType: TransactionType;
}) {
  const [{ value }, meta, { setValue }] = useField({ name: 'swapMultiplier' });

  const [{ value: swapAmount }] = useField({ name: 'swapAmount' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Swap multiplier</FormLabel>
      <FormHelperText fontSize="xs">Your swap amount will be calculated as:</FormHelperText>
      <Flex justify="center">
        <Code bg="abyss.200" color="white" borderRadius="md" p={1}>
          {swapAmount || 0} {getDenomName(initialDenom)} &times; (1 - price delta &times; {value})
        </Code>
      </Flex>
      <Flex textStyle="body-xs">
        0.1x
        <Spacer />
        10x
      </Flex>
      <Slider value={value} onChange={setValue} min={0.1} max={10} step={0.1} mb={2}>
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <Tooltip bg="abyss.200" color="white" placement="top" label={value}>
          <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
        </Tooltip>
      </Slider>

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>

      <FormHelperText fontSize="10px" bg="abyss.200" p={4} borderRadius="md" color="white">
        <Stack spacing={3}>
          <HStack justify="space-between">
            <Text>Base Buy: {swapAmount || 0} axlUSDC</Text>
            <Text>|</Text>
            <Text>Multiplier: {value}</Text>
            <Text>|</Text>
            <Text>
              Base price:{' '}
              <Text as="span" color="blue.200">
                1 KUJI = 1.17 axlUSDC{' '}
              </Text>
            </Text>
          </HStack>
          <Divider borderWidth={1} />
          <WeightsGrid swapAmount={swapAmount} swapMultiplier={value} transactionType={transactionType} />
        </Stack>
      </FormHelperText>
    </FormControl>
  );
}
