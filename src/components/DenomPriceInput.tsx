import {
  FormErrorMessage,
  FormHelperText,
  HStack,
  InputGroup,
  InputLeftElement,
  Text,
  Button,
  Link,
  Input,
  InputProps,
  Stack,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import useSpotPrice from '@hooks/useSpotPrice';
import { ReactNode } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { useChainId } from '@hooks/useChainId';
import { getOsmosisWebUrl } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { getPairAddress } from 'src/fixtures/addresses';
import { TransactionType } from './TransactionType';

export function DenomPriceInput({
  transactionType,
  initialDenom,
  resultingDenom,
  error,
  onChange,
  type,
  value,
  defaultValue,
  ...inputProps
}: {
  transactionType: TransactionType;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  error: ReactNode;
  onChange: (value: number | undefined) => void;
} & InputProps) {
  const { chainId } = useChainId();
  const { formattedPrice, isLoading } = useSpotPrice(resultingDenom, initialDenom, transactionType);

  const priceOfDenom = transactionType === TransactionType.Buy ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === TransactionType.Buy ? initialDenom : resultingDenom;

  const { name: priceOfDenomName, pricePrecision: priceOfPricePrecision } = priceOfDenom;
  const { name: priceInDenomName, pricePrecision: priceInPricePrecision } = priceInDenom;

  const pricePrecision = Math.max(priceOfPricePrecision, priceInPricePrecision);

  const handleChange = (values: NumberFormatValues) => {
    onChange(values.floatValue);
  };

  const getPairLink = {
    'osmosis-1': () => `${getOsmosisWebUrl(chainId)}?from=${priceOfDenom.osmosisId}&to=${priceInDenom.osmosisId}`,
    'osmo-test-5': () => `${getOsmosisWebUrl(chainId)}?from=${priceOfDenom.osmosisId}&to=${priceInDenom.osmosisId}`,
    'kaiyo-1': () => `https://fin.kujira.app/trade/${getPairAddress(initialDenom!.id, resultingDenom!.id)}`,
    'harpoon-4': () => `https://fin.kujira.app/trade/${getPairAddress(initialDenom!.id, resultingDenom!.id)}`,
  };

  return (
    <Stack spacing={2}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          w="max-content"
          pl={4}
          children={
            <HStack direction="row">
              <DenomIcon denomInfo={priceOfDenom} /> <Text fontSize="sm">{priceOfDenomName} Price</Text>
            </HStack>
          }
        />
        <NumericFormat
          allowNegative={false}
          decimalScale={pricePrecision}
          thousandSeparator=","
          suffix={` ${priceInDenomName}`}
          textAlign="right"
          customInput={Input}
          onValueChange={handleChange}
          value={value ? (value as number) : null}
          defaultValue={defaultValue as number}
          placeholder={`${formattedPrice ?? ''} ${priceInDenomName}`}
          {...inputProps}
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
      <FormHelperText m={0}>
        <HStack spacing={1}>
          <Text color="white" fontSize={14}>
            Current price:
          </Text>
          <Link isExternal href={chainId && getPairLink[chainId]()}>
            <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
              1 {priceOfDenomName} = {formattedPrice} {priceInDenomName}
            </Button>
          </Link>
        </HStack>
      </FormHelperText>
    </Stack>
  );
}
