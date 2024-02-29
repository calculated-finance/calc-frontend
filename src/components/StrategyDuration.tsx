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
  Image,
  Text,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { MAX_DCA_PLUS_STRATEGY_DURATION, MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';
import { getProbabilityOfOutPerformance } from '@helpers/ml/getProbabilityOfOutPerformance';

function getHistogram(probability: number | null) {
  if (!probability) {
    return '/images/histograms/histogramOne.svg';
  }
  if (probability < 0.89) {
    return '/images/histograms/histogramOne.svg';
  }
  if (probability < 0.97) {
    return '/images/histograms/histogramTwo.svg';
  }

  return '/images/histograms/histogramThree.svg';
}

export default function StrategyDuration() {
  const [{ value }, meta, { setValue }] = useField({ name: 'strategyDuration' });

  const outPerformanceProbability = getProbabilityOfOutPerformance(value);

  const outPerformanceProbabilityFormatted =
    outPerformanceProbability && `${Math.round(outPerformanceProbability * 100)}%`;

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How long would you like the strategy to last?</FormLabel>
      <FormHelperText>This will be the benchmark for comparison between DCA and DCA+</FormHelperText>
      <Flex>
        <Text fontSize="sm">Days:</Text>
        <Spacer />
        <Text fontSize="sm">Outperform probability:</Text>
      </Flex>
      <Flex color="blue.200">
        {value}
        <Spacer />
        <HStack>
          <Image src={getHistogram(outPerformanceProbability)} alt="histogram one" />
          <Text color="green.200">{outPerformanceProbabilityFormatted}</Text>
        </HStack>
      </Flex>
      <Slider
        value={value}
        onChange={setValue}
        min={MIN_DCA_PLUS_STRATEGY_DURATION}
        max={MAX_DCA_PLUS_STRATEGY_DURATION}
        step={5}
      >
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
      </Slider>
      <Flex textStyle="body">
        {MIN_DCA_PLUS_STRATEGY_DURATION} days
        <Spacer />
        {MAX_DCA_PLUS_STRATEGY_DURATION} days
      </Flex>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>

      <FormHelperText color="brand.200" fontSize="xs" bg="abyss.200" p={4} borderRadius="md">
        <HStack spacing={3}>
          <Image src="/images/lightBulbOutline.svg" alt="light bulb" />
          <Text>
            DCA+ will dynamically alter the amount swapped based on market conditions which may result in the strategy
            ending sooner or later.
          </Text>
        </HStack>
      </FormHelperText>
    </FormControl>
  );
}
