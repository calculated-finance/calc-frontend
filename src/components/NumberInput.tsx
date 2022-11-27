import { Input, InputProps } from '@chakra-ui/react';

type NumberInputProps = {
  onChange: (value: number | null) => void;
} & Omit<InputProps, 'onChange'>;

export default function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const numberValue = e.currentTarget.value;
    onChange(numberValue === '' ? null : Number(numberValue));
  };

  return <Input onChange={handleChange} value={value === null ? '' : value} {...props} />;
}
