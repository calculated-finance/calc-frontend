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
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import usePrice from '@hooks/usePrice';
import { ReactNode } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { useChainId } from '@hooks/useChain';
import { ChainId } from '@hooks/useChain/Chains';
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
  const { formattedPrice, isLoading } = usePrice(resultingDenom, initialDenom, transactionType);

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName, pricePrecision: priceOfPricePrecision } = priceOfDenom;
  const { name: priceInDenomName, pricePrecision: priceInPricePrecision } = priceInDenom;

  const pricePrecision = Math.max(priceOfPricePrecision, priceInPricePrecision);

  const handleChange = (values: NumberFormatValues) => {
    onChange(values.floatValue);
  };

  return (
    <>
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
          value={value as number}
          defaultValue={defaultValue as number}
          placeholder={`${formattedPrice} ${priceInDenomName}`}
          {...inputProps}
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
      {['kaiyo-1', 'harpoon-4'].includes(chainId) && (
        <FormHelperText>
          <Link
            isExternal
            href={`https://fin.kujira.app/trade/${getPairAddress(initialDenom!.id, resultingDenom!.id)}`}
          >
            <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
              Current price: 1 {priceOfDenomName} = {formattedPrice} {priceInDenomName}
            </Button>
          </Link>
        </FormHelperText>
      )}
      {['osmosis-1', 'osmo-test-5'].includes(chainId) && (
        <FormHelperText>
          <Link
            isExternal
            href={`${getOsmosisWebUrl(chainId)}?from=${priceOfDenom.osmosisId}&to=${priceInDenom.osmosisId}`}
          >
            <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
              Current price: 1 {priceOfDenomName} = {formattedPrice} {priceInDenomName}
            </Button>
          </Link>
        </FormHelperText>
      )}
    </>
  );
}
