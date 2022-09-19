import { Select as ChakraSelect, SelectComponent, useChakraSelectProps } from 'chakra-react-select';
import { SelectProps as ChakraSelectProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export type OptionType = {
  value: string;
  label: ReactNode | string;
};

type SelectProps = {
  options: OptionType[];
  customComponents?: Partial<SelectComponent>;
  onChange: (value?: string) => void;
} & Omit<ChakraSelectProps, 'onChange'>;

export default function Select({ options, placeholder, onChange, value, customComponents }: SelectProps) {
  const selectProps = useChakraSelectProps({
    useBasicStyles: true,
    onChange: (option) => {
      onChange(option?.value);
    },
    options,
    placeholder,
    value: options?.find((option: OptionType) => value === option.value),
    chakraStyles: {
      control: (provided) => ({
        ...provided,
        isReadOnly: true,
        caretColor: 'transparent',
      }),
      menuList: (provided) => ({
        ...provided,
        bg: 'deepHorizon',
      }),
    },
    components: customComponents,
  });

  return <ChakraSelect {...selectProps} />;
}
