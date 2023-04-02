import { InputGroup, InputLeftElement, InputRightElement, Input, InputProps } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import DenomIcon from '@components/DenomIcon';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

type DenomInputProps = {
  onChange: (value: number | undefined) => void;
} & Omit<InputProps, 'onChange'>;

export function DenomInput({
  denom,
  value,
  onChange,
  type,
  defaultValue,
  ...props
}: { denom: string } & DenomInputProps) {
  const { name } = getDenomInfo(denom);

  const handleChange = (values: NumberFormatValues) => {
    onChange(values.floatValue);
  };

  return (
    <InputGroup>
      <InputLeftElement>
        <DenomIcon denomName={denom} />
      </InputLeftElement>
      <NumericFormat
        pl={10}
        placeholder="Enter amount"
        customInput={Input}
        allowNegative={false}
        onValueChange={handleChange}
        value={value as number}
        defaultValue={defaultValue as number}
        thousandSeparator=","
        {...props}
      />
      <InputRightElement textStyle="body-xs" w="min-content" p={3}>
        {name}
      </InputRightElement>
    </InputGroup>
  );
}
