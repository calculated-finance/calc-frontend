import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Link,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AvailableFunds } from "@components/AvailableFunds";
import usePrice from "@hooks/usePrice";
import getDenomInfo from "@utils/getDenomInfo";
import { useField } from "formik";
import { TransactionType } from "../../components/TransactionType";



function convertDecimalToPercent(decimal: number) {
  const convertedPercentage = (decimal * 100).toFixed(0)
  return convertedPercentage
}


export function OverCollateralisedDeposit() {

  // const { transactionType} = useStrategyInfo();
  const [{ value }, meta, { setValue }] = useField({ name: 'collateralisedMultiplier' });
  const [{ value: initialDeposit }] = useField({ name: 'initialDeposit' });
  const [{ value: initialDenomValue }] = useField({ name: 'initialDenom' });
  const [{ value: resultingDenomValue }] = useField({ name: 'resultingDenom' });
  const [{ value: applyMultiplier }] = useField({ name: 'applyCollateralisedMultiplier' });

  const initialDenom = getDenomInfo(initialDenomValue)
  const resultingDenom = getDenomInfo(resultingDenomValue)
  const { price } = usePrice(initialDenom, resultingDenom, TransactionType.Sell, true)

  const setMinMultiplier = () => {
    setValue(1.20)
  }
  const setMaxMultiplier = () => {
    setValue(2.50)
  }

  const totalOverCollateralisedAmount = (value * initialDeposit).toFixed(2)
  return (
    // Boolean(meta.touched && meta.error)
    <FormControl isInvalid={Boolean(1 * 2 === 2)}>
      <FormLabel>Over-collateralised deposit amount.</FormLabel>
      <HStack spacing={4}>
        <FormHelperText fontSize="xs">To counter price volatility, we recommend you deposit at least 120%.</FormHelperText>
        {initialDenomValue && <AvailableFunds denom={getDenomInfo(initialDenomValue)} />}

      </HStack>
      <Flex textStyle="body-xs">
        <Button as={Link} variant='unstyled' textColor='blue.200' onClick={setMinMultiplier}  >120%</Button>
        <Spacer />
        <Button as={Link} variant='unstyled' textColor='blue.200' onClick={setMaxMultiplier}>250%</Button>
      </Flex>
      <Slider value={value} defaultValue={1.20} onChange={setValue} min={1.20} max={2.50} step={0.01}>
        <SliderTrack bg="white">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="blue.200" />
        </SliderTrack>
        <Tooltip bg="abyss.200" color="white" placement="top" label={`${convertDecimalToPercent(value)}%`}>
          <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
        </Tooltip>
      </Slider>

      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      <Flex justify="center">
        <Code bg="abyss.200" color="white" borderRadius="md" px={2} py={1}>
          <HStack>
            {initialDeposit && value ?
              <>
                <Text >
                  {initialDeposit}
                </Text>
                <Image src={initialDenom.icon} boxSize={4} />
                <Text>
                  &times; {value} = {totalOverCollateralisedAmount}
                </Text>
                <Image src={initialDenom.icon} boxSize={4} />
              </>
              :
              <HStack p={2} textAlign='center' fontSize='xs'>
                <Text>((Target amount/Current price) &times; %)</Text>
                <Text>=</Text>
                <Text>Over-collateralised deposit</Text>
              </HStack>
            }
          </HStack>
        </Code>
      </Flex>
    </FormControl >

  )
}