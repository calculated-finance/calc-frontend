import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Link,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import useFiatPrice from "@hooks/useFiatPrice";
import getDenomInfo from "@utils/getDenomInfo";
import DenomIcon from "@components/DenomIcon";
import { MAX_OVER_COLATERALISED, MIN_OVER_COLATERALISED, RECOMMENDED_OVER_COLATERALISED } from "src/constants";
import { useField } from "formik";
import { OneOffAvailableFunds } from "./OneOffAvailableFunds";
import { useEffect } from "react";
import { initialCtrlValues } from "./ControlDeskForms";



function convertDecimalToPercent(decimal: number) {
  const convertedPercentage = (decimal * 100).toFixed(0)
  return convertedPercentage
}


export function OverCollateralisedDeposit() {

  const [{ value: initialDenomValue }] = useField({ name: 'initialDenom' });
  const [{ value: targetAmount }] = useField({ name: 'targetAmount' });
  const [{ value }, meta, { setValue }] = useField({ name: 'collateralisedMultiplier' });
  const [, , { setValue: setTotalCollateralisedValue }] = useField({ name: 'totalCollateralisedAmount' });
  const initialDenom = getDenomInfo(initialDenomValue)
  const { price } = useFiatPrice(initialDenom)
  const totalOverCollateralisedAmount = price && (Number(targetAmount) / price * value).toFixed(2)
  const minOverCollateralisedAmount = price && (Number(targetAmount) / price * MIN_OVER_COLATERALISED).toFixed(2)
  const maxOverCollateralisedAmount = price && (Number(targetAmount) / price * MAX_OVER_COLATERALISED).toFixed(2)


  useEffect(() => {
    setValue(initialCtrlValues.collateralisedMultiplier)
    setTotalCollateralisedValue(totalOverCollateralisedAmount)
  }, [value, totalOverCollateralisedAmount])

  const setMinMultiplier = () => {
    setValue(MIN_OVER_COLATERALISED)
  }
  const setMaxMultiplier = () => {
    setValue(MAX_OVER_COLATERALISED)
  }



  const setTotalCollateralise = () => {
    setTotalCollateralisedValue(totalOverCollateralisedAmount)
  }

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Over-collateralised deposit amount.</FormLabel>
      <HStack spacing={6}>
        <FormHelperText fontSize="xs">To counter price volatility, we recommend you deposit at least 120%.</FormHelperText>
        <Spacer />
        {initialDenomValue && <OneOffAvailableFunds inputPrice={price} denom={getDenomInfo(initialDenomValue)} />}
      </HStack>
      <Flex textStyle="body-xs">
        <Button as={Link} variant='unstyled' textColor='blue.200' onClick={setMinMultiplier}  >{`${convertDecimalToPercent(MIN_OVER_COLATERALISED)}%`}</Button>
        <Spacer />
        <Button as={Link} variant='unstyled' textColor='blue.200' onClick={setMaxMultiplier}>{`${convertDecimalToPercent(MAX_OVER_COLATERALISED)}%`}</Button>
      </Flex>
      <VStack spacing={0} >
        <Slider value={value} defaultValue={RECOMMENDED_OVER_COLATERALISED} onChange={setValue} min={MIN_OVER_COLATERALISED} max={MAX_OVER_COLATERALISED} step={0.01} onChangeEnd={setTotalCollateralise}>
          <SliderTrack bg="white">
            <Box position="relative" right={10} />
            <SliderFilledTrack bg="blue.200" />
          </SliderTrack>
          <Tooltip bg="abyss.200" color="white" placement="top" label={value ? `${convertDecimalToPercent(value)}%` : `${convertDecimalToPercent(RECOMMENDED_OVER_COLATERALISED)}%`} >
            <SliderThumb boxSize={6} bg="blue.200" borderWidth={1} borderColor="abyss.200" />
          </Tooltip>
        </Slider>
        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        <SimpleGrid columns={3} w='full' flex='flex-end'>
          <FormHelperText>
            <Text textStyle="body-xs">{minOverCollateralisedAmount} {initialDenom.name}</Text>
          </FormHelperText>
          <Flex gap={2} align='center' justifySelf='center'>
            {targetAmount && value &&
              <>
                <Text>
                  ~{totalOverCollateralisedAmount}
                </Text>
                <DenomIcon denomInfo={initialDenom} />
              </>}
          </Flex>
          <FormHelperText textAlign='right'>
            <Text textStyle="body-xs">{maxOverCollateralisedAmount} {initialDenom.name}</Text>
          </FormHelperText>
        </SimpleGrid>
        <FormHelperText >
          <Text color='brand.200' fontSize='xs'>
            Once the target amount is reached, the remaining funds will be returned to your wallet.
          </Text>
        </FormHelperText>
      </VStack>
    </FormControl >

  )
}