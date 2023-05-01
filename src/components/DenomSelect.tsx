import { Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';
import { OptionProps, chakraComponents } from 'chakra-react-select';
import Select, { SelectProps } from './Select';

function DenomSelectLabel({ denom }: { denom: Denom }) {
  const { name } = getDenomInfo(denom);
  return (
    <HStack flexGrow={1}>
      <DenomIcon denomName={denom} />
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
}: { denoms: Denom[]; optionLabel?: string; showPromotion?: boolean } & Omit<SelectProps, 'options'>) {
  const customComponents = () => ({
    Option: getDenomOptionComponent(optionLabel),
  });
  const pairsOptions = denoms.map((denom) => ({
    value: denom,
    label: <DenomSelectLabel denom={denom} />,
  }));
  return <Select options={pairsOptions} customComponents={customComponents()} {...selectProps} />;
}
