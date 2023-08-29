import {
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react";
import getDenomInfo from "@utils/getDenomInfo";
import { useField } from "formik";
import { OneOffAvailableFunds } from "./OneOffAvailableFunds";
import useFiatPrice from "@hooks/useFiatPrice";



function convertDecimalToPercent(decimal: number) {
  const convertedPercentage = (decimal * 100).toFixed(0)
  return convertedPercentage
}


export function OverCollateralisedDeposit() {

  const [{ value }, meta, { setValue }] = useField({ name: 'collateralisedMultiplier' });
  const [{ value: targetAmount }] = useField({ name: 'targetAmount' });
  const [{ value: initialDenomValue }] = useField({ name: 'initialDenom' });
  const [{ value: applyMultiplier }] = useField({ name: 'applyCollateralisedMultiplier' });

  const initialDenom = getDenomInfo(initialDenomValue)
  const { price } = useFiatPrice(initialDenom)

  const setMinMultiplier = () => {
    setValue(1.20)
  }
  const setMaxMultiplier = () => {
    setValue(2.50)
  }

  const totalOverCollateralisedAmount = price && (Number(targetAmount / price) * value).toFixed(2)
  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Over-collateralised deposit amount.</FormLabel>
      <HStack spacing={4}>
        <FormHelperText fontSize="xs">To counter price volatility, we recommend you deposit at least 120%.</FormHelperText>
        {initialDenomValue && <OneOffAvailableFunds inputPrice={price} denom={getDenomInfo(initialDenomValue)} />}
      </HStack>

      <Flex textStyle="body-xs">
        <Button as={Link} variant='unstyled' textColor='blue.200' onClick={setMinMultiplier}  >120%</Button>
        <Spacer />
        <Button as={Link} variant='unstyled' textColor='blue.200' onClick={setMaxMultiplier}>250%</Button>
      </Flex>
      <VStack spacing={0} >
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
        <HStack>
          <FormHelperText>
            <Text textStyle="body-xs">((Target amount/Current price)*120%) {initialDenom.name}</Text>
          </FormHelperText>
          <Spacer />
          {targetAmount && value &&
            <>
              <Text>
                {totalOverCollateralisedAmount}
              </Text>
              <Image src={initialDenom.icon} boxSize={4} />
            </>}
          <FormHelperText textAlign='right'>
            <Text textStyle="body-xs">((Target amount/Current price)*250%) {initialDenom.name}</Text>
          </FormHelperText>
        </HStack>
        <FormHelperText >
          <Text color='brand.200' fontSize='xs'>
            Once the target amount is reached, the remaining funds will be returned to your wallet.
          </Text>
        </FormHelperText>
      </VStack>
    </FormControl >

  )
}