import { useRadioGroup, HStack } from '@chakra-ui/react';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';

export const daysData = [
  { value: '1', label: '1D' },
  { value: '3', label: '3D' },
  { value: '7', label: '1W' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
  { value: '365', label: '1Y' },
];

export function DaysRadio({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    value,
    onChange,
  });

  return (
    <HStack spacing={0}>
      <Radio {...getRootProps} px={0}>
        {daysData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard key={option.label} {...radio}>
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </HStack>
  );
}
