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
  showPromotion,
  isSelected,
  rightLabel,
  children,
  ...optionProps
}: OptionProps & { denom: Denom; rightLabel?: string; showPromotion?: boolean }) {
  const { promotion } = getDenomInfo(denom);
  return (
    <chakraComponents.Option isSelected={isSelected} {...optionProps}>
      <Flex alignItems="center" w="full">
        {children}
        <Spacer />
        {showPromotion && promotion && !rightLabel && (
          <Badge colorScheme={isSelected ? 'abyss' : 'blue'}>0% fees</Badge>
        )}
        {rightLabel && <Text fontSize="xs">{rightLabel}</Text>}
      </Flex>
    </chakraComponents.Option>
  );
}

function getDenomOptionComponent(rightLabel?: string, showPromotion?: boolean) {
  // eslint-disable-next-line func-names
  return function ({ children: childrenProp, data, isSelected, ...props }: any) {
    return (
      <DenomOption
        denom={data.value}
        isSelected={isSelected}
        rightLabel={rightLabel}
        showPromotion={showPromotion}
        {...props}
      >
        {childrenProp}
      </DenomOption>
    );
  };
}

export function DenomSelect({
  denoms,
  optionLabel,
  showPromotion = false,
  ...selectProps
}: { denoms: Denom[]; optionLabel?: string; showPromotion?: boolean } & Omit<SelectProps, 'options'>) {
  const customComponents = () => ({
    Option: getDenomOptionComponent(optionLabel, showPromotion),
  });
  const pairsOptions = denoms.map((denom) => ({
    value: denom,
    label: <DenomSelectLabel denom={denom} />,
  }));
  return <Select options={pairsOptions} customComponents={customComponents()} {...selectProps} />;
}
