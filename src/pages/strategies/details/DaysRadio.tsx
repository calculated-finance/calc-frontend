import { useRadioGroup, HStack } from '@chakra-ui/react';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { ChartTimeRange } from '@components/TimeRange';

const daysData = [
  { value: ChartTimeRange.OneHour, label: '1Hr' },
  { value: ChartTimeRange.OneDay, label: '1D' },
  { value: ChartTimeRange.ThreeDays, label: '3D' },
  { value: ChartTimeRange.OneWeek, label: '1W' },
  { value: ChartTimeRange.OneMonth, label: '1M' },
  { value: ChartTimeRange.ThreeMonths, label: '3M' },
  { value: ChartTimeRange.OneYear, label: '1Y' },
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
