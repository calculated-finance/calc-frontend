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
import getDenomInfo from '@utils/getDenomInfo';
import usePrice from '@hooks/usePrice';
import { Denom } from '@models/Denom';
import { ReactNode } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
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
  initialDenom: Denom;
  resultingDenom: Denom;
  error: ReactNode;
  onChange: (value: number | undefined) => void;
} & InputProps) {
  const { price, pairAddress, isLoading } = usePrice(resultingDenom, initialDenom, transactionType);

  const priceOfDenom = transactionType === 'buy' ? resultingDenom : initialDenom;
  const priceInDenom = transactionType === 'buy' ? initialDenom : resultingDenom;

  const { name: priceOfDenomName } = getDenomInfo(priceOfDenom);
  const { name: priceInDenomName } = getDenomInfo(priceInDenom);

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
              <DenomIcon denomName={priceOfDenom} /> <Text fontSize="sm">{priceOfDenomName} Price</Text>
            </HStack>
          }
        />
        <NumericFormat
          allowNegative={false}
          decimalScale={3}
          thousandSeparator=","
          suffix={` ${priceInDenomName}`}
          textAlign="right"
          customInput={Input}
          onValueChange={handleChange}
          value={value as number}
          defaultValue={defaultValue as number}
          placeholder={`${price} ${priceInDenomName}`}
          {...inputProps}
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
      {Boolean(price) && (
        <FormHelperText>
          <Link isExternal href={`https://fin.kujira.app/trade/${pairAddress}`}>
            <Button variant="link" fontWeight="normal" isLoading={isLoading} colorScheme="blue">
              Current price: 1 {priceOfDenomName} = {price} {priceInDenomName}
            </Button>
          </Link>
        </FormHelperText>
      )}
    </>
  );
}
