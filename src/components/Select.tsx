import { Select as ChakraSelect, SelectComponent, useChakraSelectProps } from 'chakra-react-select';
import { SelectProps as ChakraSelectProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export type OptionType = {
  value: string;
  label: ReactNode | string;
};

export type SelectProps = {
  options: OptionType[];
  customComponents?: Partial<SelectComponent>;
  onChange: (value?: string) => void;
  menuPortalTarget?: HTMLElement;
} & Omit<ChakraSelectProps, 'onChange'>;

export default function Select({
  options,
  placeholder,
  onChange,
  value,
  customComponents,
  menuPortalTarget,
}: SelectProps) {
  const selectProps = useChakraSelectProps({
    menuPortalTarget,
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
        minW: 0,
        bg: 'deepHorizon',
      }),
    },
    components: customComponents,
  });

  return <ChakraSelect {...selectProps} />;
}
