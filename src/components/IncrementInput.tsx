import { InputGroup, Input, InputProps } from '@chakra-ui/react';
import { NumericFormat } from 'react-number-format';

type IncrementInputProps = {
  onChange: (value: number | undefined) => void;
} & Omit<InputProps, 'onChange'>;

export function IncrementInput() {
  return (
    <InputGroup>
      <NumericFormat
        pl={10}
        placeholder="Enter amount"
        customInput={Input}
        allowNegative={false}
        thousandSeparator=","
        defaultValue={0}
        style={{ textAlign: 'right' }}
      />
    </InputGroup>
  );
}
