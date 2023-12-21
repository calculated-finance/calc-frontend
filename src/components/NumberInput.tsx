import { Input, InputProps } from '@chakra-ui/react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

type NumberInputProps = {
  onChange: (value: number | null) => void;
  decimalScale?: number;
} & Omit<InputProps, 'onChange'>;

export default function NumberInput({ value, onChange, type, defaultValue, ...props }: NumberInputProps) {
  const handleChange = (values: NumberFormatValues) => {
    try {
      onChange(values.floatValue || null);
    } catch (error) {
      // swallow
    }
  };

  return (
    <NumericFormat
      customInput={Input}
      allowNegative={false}
      onValueChange={handleChange}
      value={value as number}
      defaultValue={defaultValue as number}
      thousandSeparator=","
      {...props}
    />
  );
}
