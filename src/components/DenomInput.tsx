import { InputGroup, InputLeftElement, InputRightElement, Input, InputProps } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { InitialDenomInfo } from '@utils/DenomInfo';

type DenomInputProps = {
  onChange: (value: number | undefined) => void;
  denom: InitialDenomInfo | undefined;
} & Omit<InputProps, 'onChange'>;

export function DenomInput({ denom, value, onChange, type, defaultValue, ...props }: DenomInputProps) {
  const handleChange = (values: NumberFormatValues) => {
    onChange(values.floatValue);
  };
  return (
    <InputGroup>
      {denom && (
        <InputLeftElement>
          <DenomIcon denomInfo={denom} />
        </InputLeftElement>
      )}
      <NumericFormat
        pl={denom ? 10 : undefined}
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
        {denom?.name}
      </InputRightElement>
    </InputGroup>
  );
}
