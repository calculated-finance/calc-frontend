import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Link,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { useField } from "formik";




export function OverCollateralisedDeposit() {

  // const { transactionType} = useStrategyInfo();
  const [{ value }, meta, { setValue }] = useField({ name: 'collateralisedMultiplier' });
  const [{ value: initialDeposit }] = useField({ name: 'initialDeposit' });
  const [{ value: applyMultiplier }] = useField({ name: 'applyCollateralisedMultiplier' });

  console.log(initialDeposit)
  console.log('overCollateralised Deposit amount:', initialDeposit * value)
  return (
    // Boolean(meta.touched && meta.error)
    <FormControl isInvalid={Boolean(1 * 2 === 2)}>
      <FormLabel>Over-collateralised deposit amount.</FormLabel>
      <FormHelperText fontSize="xs">To counter price volatility, we recommend you deposit at least 120%.</FormHelperText>
      <Flex textStyle="body-xs">
        <Button as={Link} variant='unstyled' textColor='blue.200'  >120%</Button>
        <Spacer />
        <Button as={Link} variant='unstyled' textColor='blue.200'>250%</Button>
      </Flex>
      <Slider value={value} onChange={setValue} min={1.20} max={2.50} step={0.01}>
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <Tooltip bg="abyss.200" color="white" placement="top" label={value}>
          <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
        </Tooltip>
      </Slider>

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>

    </FormControl>
  )
}