import { Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { OptionProps, chakraComponents } from 'chakra-react-select';
import { DenomInfo } from '@utils/DenomInfo';
import Select, { OptionType, SelectProps } from './Select';

function DenomSelectLabel({ denom }: { denom: DenomInfo }) {
  const { name } = denom;
  return <DenomIcon denomInfo={denom} />;
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

  const pairsOptions: OptionType[] = denoms.map((denom) => ({
    value: denom.id,
    label: [
      <HStack spacing={4}>
        <DenomSelectLabel denom={denom} />
      </HStack>,
      denom.name,
    ],
  }));
  return <Select isSearchable={true} options={pairsOptions} customComponents={customComponents()} {...selectProps} />;
}
