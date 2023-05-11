import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Code,
  Tooltip,
} from '@chakra-ui/react';
import { Denom } from '@models/Denom';
import YesNoValues from '@models/YesNoValues';
import { getDenomName } from '@utils/getDenomInfo';
import { useField } from 'formik';
import { TransactionType } from './TransactionType';
import { WeightSummary } from './WeightSummary';

export default function SwapMultiplier({
  initialDenom,
  transactionType,
}: {
  initialDenom: Denom;
  transactionType: TransactionType;
}) {
  const [{ value }, meta, { setValue }] = useField({ name: 'swapMultiplier' });

  const [{ value: swapAmount }] = useField({ name: 'swapAmount' });

  const [{ value: applyMultiplier }] = useField({ name: 'applyMultiplier' });
  const [{ value: basePrice }] = useField({ name: 'basePriceValue' });
  const [{ value: basePriceIsCurrentPrice }] = useField({ name: 'basePriceIsCurrentPrice' });

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
        <Tooltip bg="abyss.200" color="white" placement="top" label={value}>
          <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
        </Tooltip>
      </Slider>

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>

      <WeightSummary
        transactionType={transactionType}
        applyMultiplier={applyMultiplier}
        swapMultiplier={value}
        swapAmount={swapAmount}
        basePrice={basePriceIsCurrentPrice === YesNoValues.No ? basePrice : null}
      />
    </FormControl>
  );
}
