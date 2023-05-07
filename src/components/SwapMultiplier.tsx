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
} from '@chakra-ui/react';
import { Denom } from '@models/Denom';
import { getDenomName } from '@utils/getDenomInfo';
import { useField } from 'formik';

function WeightsGrid({ swapAmount, swapMultiplier }: { swapAmount: number; swapMultiplier: number }) {
  const calcSwapFromPriceDelta = (priceDelta: number) =>
    (Number(swapAmount) * (1 - priceDelta * Number(swapMultiplier))).toFixed(1);

  return (
    <Grid templateColumns="repeat(12, 1fr)" columnGap={2} rowGap={3}>
      <GridItem colSpan={3}>Price Delta</GridItem>
      <GridItem color="red.200" colSpan={1}>
        -50%
      </GridItem>
      <GridItem color="red.200" colSpan={1}>
        -10%
      </GridItem>
      <GridItem color="red.200" colSpan={1}>
        -5%
      </GridItem>
      <GridItem color="red.200" colSpan={1}>
        -1%
      </GridItem>
      <GridItem colSpan={1}>0%</GridItem>
      <GridItem color="green.200" colSpan={1}>
        +1%
      </GridItem>
      <GridItem color="green.200" colSpan={1}>
        +5%
      </GridItem>
      <GridItem color="green.200" colSpan={1}>
        +10%
      </GridItem>
      <GridItem color="green.200" colSpan={1}>
        +50%
      </GridItem>
      <GridItem colSpan={3}>Buy amount:</GridItem>
      <GridItem colSpan={1}>{calcSwapFromPriceDelta(-0.5)}</GridItem>
      <GridItem colSpan={1}>{calcSwapFromPriceDelta(-0.1)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(-0.05)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(-0.01)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(0)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(0.01)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(0.05)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(0.1)}</GridItem>
      <GridItem colSpan={1}> {calcSwapFromPriceDelta(0.5)}</GridItem>
    </Grid>
  );
}

export default function SwapMultiplier({ initialDenom }: { initialDenom: Denom }) {
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
      <Slider value={value} onChange={setValue} min={0.1} max={10} step={0.1}>
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
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
          <WeightsGrid swapAmount={swapAmount} swapMultiplier={value} />
        </Stack>
      </FormHelperText>
    </FormControl>
  );
}
