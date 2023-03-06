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
} from '@chakra-ui/react';
import { useField } from 'formik';
import { MAX_DCA_PLUS_STRATEGY_DURATION, MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';

export default function StrategyDuration() {
  const [{ value }, meta, { setValue }] = useField({ name: 'strategyDuration' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>On average, how long would you like the strategy to last?</FormLabel>
      <FormHelperText>This will be the benchmark for comparison between DCA and DCA+</FormHelperText>
      <Flex>
        Days:
        <Spacer />
        Our performance probability:
      </Flex>
      <Flex color="blue.200">
        {value}
        <Spacer />
        77%
      </Flex>
      <Slider
        value={value}
        onChange={setValue}
        min={MIN_DCA_PLUS_STRATEGY_DURATION}
        max={MAX_DCA_PLUS_STRATEGY_DURATION}
        step={1}
      >
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
      </Slider>
      <Flex textStyle="body">
        30 days
        <Spacer />
        180 days
      </Flex>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>

      <FormHelperText color="brand.200" fontSize="xs">
        Please note, DCA+ will dynamically alter the amount purchased based on market conditions which may result in the
        strategy ending sooner or later.
      </FormHelperText>
    </FormControl>
  );
}
