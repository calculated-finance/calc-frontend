import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Spacer,
  Text,
  Button,
  Center,
  Input,
  InputProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { Denom } from '@hooks/usePairs';
import useBalance from '@hooks/useBalance';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import DenomIcon from '@components/DenomIcon';

type NumberInputProps = {
  onChange: (value: number | null) => void;
} & Omit<InputProps, 'onChange'>;

function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const numberValue = e.currentTarget.value;
    onChange(numberValue === '' ? null : Number(numberValue));
  };

  return <Input type="number" onChange={handleChange} value={value === null ? undefined : value} {...props} />;
}

function AvailableFunds({ quoteDenom }: { quoteDenom: Denom }) {
  const { displayAmount, isLoading } = useBalance({
    token: quoteDenom,
  });

  const [, , helpers] = useField('topUpAmount');

  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

  return (
    <Center textStyle="body-xs">
      <Text mr={1}>Available: </Text>
      <Button
        size="xs"
        isLoading={isLoading}
        colorScheme="blue"
        variant="link"
        cursor="pointer"
        isDisabled={!displayAmount}
        onClick={handleClick}
      >
        {displayAmount || 'None'}
      </Button>
    </Center>
  );
}

export default function TopUpAmount({ quoteDenom }: { quoteDenom: Denom }) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'topUpAmount' });

  const { name } = getDenomInfo(quoteDenom);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much do you want to add?</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">You must deposit the same asset.</Text>
          <Spacer />
          <AvailableFunds quoteDenom={quoteDenom} />
        </Center>
      </FormHelperText>
      <InputGroup>
        <InputLeftElement>
          <DenomIcon denomName={quoteDenom} />
        </InputLeftElement>
        <NumberInput pl={10} onChange={helpers.setValue} placeholder="Choose amount" {...field} />

        <InputRightElement textAlign="right" mr={3} textStyle="body-xs">
          <Text>{name}</Text>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
