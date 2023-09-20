import { Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { OptionProps, chakraComponents } from 'chakra-react-select';
import { DenomInfo } from '@utils/DenomInfo';
import { featureFlags } from 'src/constants';
import Select, { OptionTypeDenomSelect, SelectDenomWithSearch, SelectProps } from './Select';

function DenomSelectLabel({ denom }: { denom: DenomInfo }) {
  const { name } = denom;
  return (
    <HStack flexGrow={1}>
      <DenomIcon denomInfo={denom} />
      <Text>{name}</Text>
    </HStack>
  );
}

function DenomOption({
  showPromotion,
  isSelected,
  rightLabel,
  children,
  ...optionProps
}: OptionProps & { rightLabel?: string; showPromotion?: boolean }) {
  return (
    <chakraComponents.Option isSelected={isSelected} {...optionProps}>
      <Flex alignItems="center" w="full">
        {children}
        <Spacer />
        {rightLabel && <Text fontSize="xs">{rightLabel}</Text>}
      </Flex>
    </chakraComponents.Option>
  );
}

function getDenomOptionComponent(rightLabel?: string) {
  // eslint-disable-next-line func-names
  return function ({ children: childrenProp, isSelected, ...props }: OptionProps) {
    return (
      <DenomOption isSelected={isSelected} rightLabel={rightLabel} {...props}>
        {childrenProp}
      </DenomOption>
    );
  };
}

export function DenomSelect({
  denoms,
  optionLabel,
  ...selectProps
}: { denoms: DenomInfo[]; optionLabel?: string; showPromotion?: boolean } & Omit<SelectProps, 'options'>) {
  const customComponents = () => ({
    Option: getDenomOptionComponent(optionLabel),
  });

  if (featureFlags.searchDenomInputEnabled) {
    const pairsOptions: OptionTypeDenomSelect[] = denoms.map((denom) => ({
      value: [denom.id, denom.name],
      label: <DenomSelectLabel denom={denom} />,
    }));
    return (
      <SelectDenomWithSearch
        isSearchable
        options={pairsOptions}
        customComponents={customComponents()}
        {...selectProps}
      />
    );
  }

  const pairsOptions = denoms.map((denom) => ({
    value: denom.id,
    label: <DenomSelectLabel denom={denom} />,
  }));

  return <Select isSearchable={false} options={pairsOptions} customComponents={customComponents()} {...selectProps} />;
}
