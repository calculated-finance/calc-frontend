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
} from '@chakra-ui/react';
import { useField } from 'formik';

export default function SwapMultiplier() {
  const [{ value }, meta, { setValue }] = useField({ name: 'swapMultiplier' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Swap multiplier</FormLabel>
      <FormHelperText fontSize="xs">
        Swap amounts are calculated as:\nbase_buy * (1 - (price_delta * multiplier))
      </FormHelperText>
      <Flex color="blue.200">20 axlUSDC * (1 - price delta * 3)</Flex>
      <Slider value={value} onChange={setValue} min={0.1} max={10} step={0.1}>
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
      </Slider>
      <Flex textStyle="body">
        0.1x
        <Spacer />
        10x
      </Flex>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>

      <FormHelperText fontSize="10px" bg="abyss.200" p={4} borderRadius="md" color="white">
        <Stack spacing={3}>
          <HStack>
            <Text>Base Buy: 20 axlUSDC</Text>
            <Text>|</Text>
            <Text>Multiplier: 3</Text>
            <Text>|</Text>
            <Text>
              Base price:{' '}
              <Text as="span" color="blue.200">
                1 KUJI = 1.17 axlUSDC{' '}
              </Text>
            </Text>
          </HStack>
          <Divider borderWidth={1} />
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
            <GridItem colSpan={1}>50</GridItem>
            <GridItem colSpan={1}>26</GridItem>
            <GridItem colSpan={1}>23</GridItem>
            <GridItem colSpan={1}>20.6</GridItem>
            <GridItem colSpan={1}>20</GridItem>
            <GridItem colSpan={1}>19.4</GridItem>
            <GridItem colSpan={1}>17</GridItem>
            <GridItem colSpan={1}>14</GridItem>
            <GridItem colSpan={1}>0</GridItem>
          </Grid>
        </Stack>
      </FormHelperText>
    </FormControl>
  );
}
