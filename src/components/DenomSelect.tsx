import { Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { Denom } from '@hooks/usePairs';
import getDenomInfo from '@utils/getDenomInfo';
import { OptionProps, chakraComponents } from 'chakra-react-select';
import Select, { SelectProps } from './Select';

function DenomSelectLabel({ denom }: { denom: Denom }) {
  return (
    <HStack flexGrow={1}>
      <DenomIcon denomName={denom} />
      <Text>{getDenomInfo(denom).name}</Text>
    </HStack>
  );
}

function getDenomOptionComponent(rightLabel?: string) {
  function DenomOption({ children, ...props }: OptionProps) {
    return (
      <chakraComponents.Option {...props}>
        <Flex alignItems="center" w="full">
          {children}
          <Spacer />
          {rightLabel && <Text fontSize="xs">{rightLabel}</Text>}
        </Flex>
      </chakraComponents.Option>
    );
  }
  return DenomOption;
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
