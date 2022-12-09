import { Badge, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
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
  denom,
  isSelected,
  rightLabel,
  children,
  ...optionProps
}: OptionProps & { denom: Denom; rightLabel?: string }) {
  const { promotion } = getDenomInfo(denom);
  return (
    <chakraComponents.Option isSelected={isSelected} {...optionProps}>
      <Flex alignItems="center" w="full">
        {children}
        <Spacer />
        {promotion && !rightLabel && <Badge colorScheme={isSelected ? 'abyss' : 'blue'}>PROMO</Badge>}
        {rightLabel && <Text fontSize="xs">{rightLabel}</Text>}
      </Flex>
    </chakraComponents.Option>
  );
}

function getDenomOptionComponent(rightLabel?: string) {
  // eslint-disable-next-line func-names
  return function ({ children: childrenProp, data, isSelected, ...props }: any) {
    return (
      <DenomOption denom={data.value} isSelected={isSelected} rightLabel={rightLabel} {...props}>
        {childrenProp}
      </DenomOption>
    );
  };
}

export function DenomSelect({
  denoms,
  optionLabel,
  ...selectProps
}: { denoms: Denom[]; optionLabel?: string } & Omit<SelectProps, 'options'>) {
  const customComponents = () => ({
    Option: getDenomOptionComponent(optionLabel),
  });
  const pairsOptions = denoms.map((denom) => ({
    value: denom,
    label: <DenomSelectLabel denom={denom} />,
  }));
  return <Select options={pairsOptions} customComponents={customComponents()} {...selectProps} />;
}
