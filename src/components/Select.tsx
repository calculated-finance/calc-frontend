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
  isSearchable?: boolean;
} & Omit<ChakraSelectProps, 'onChange'>;

export default function Select({
  options,
  placeholder,
  onChange,
  value,
  customComponents,
  menuPortalTarget,
  isSearchable = true,
}: SelectProps) {
  const selectProps = useChakraSelectProps({
    menuPortalTarget,
    useBasicStyles: true,
    onChange: (option) => {
      onChange(option?.value);
    },
    options,
    placeholder,
    isSearchable,
    value: options?.find((option: OptionType) => value === option.value || null),
    chakraStyles: {
      control: (provided) => ({
        ...provided,
        isReadOnly: true,
        caretColor: 'transparent',
      }),
    },
    components: customComponents,
  });

  return <ChakraSelect {...selectProps} />;
}

export type OptionTypeDenomSelect = {
  value: [string, string];
  label: ReactNode;
};
export type SelectPropsDenomSelect = {
  options: OptionTypeDenomSelect[];
  customComponents?: Partial<SelectComponent>;
  onChange: (value?: string) => void;
  menuPortalTarget?: HTMLElement;
  isSearchable?: boolean;
} & Omit<ChakraSelectProps, 'onChange'>;

export function SelectDenomWithSearch({
  options,
  placeholder,
  onChange,
  value,
  customComponents,
  menuPortalTarget,
  isSearchable = true,
}: SelectPropsDenomSelect) {
  const selectProps = useChakraSelectProps({
    menuPortalTarget,
    useBasicStyles: true,
    onChange: (option) => {
      const [id] = option?.value || [];
      onChange(id);
    },
    options,
    placeholder,
    isSearchable,
    value: value
      ? options?.find((option: OptionTypeDenomSelect) => {
          const [id] = option?.value || [];
          return value === id || null;
        })
      : null,
    chakraStyles: {
      control: (provided) => ({
        ...provided,
        isReadOnly: true,
        caretColor: 'transparent',
      }),
    },
    components: customComponents,
  });

  return <ChakraSelect {...selectProps} />;
}
