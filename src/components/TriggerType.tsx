import { RadioGroup, Stack, Radio, Text } from '@chakra-ui/react';
import { useField } from 'formik';
import TriggerTypes from '@models/TriggerTypes';
import YesNoValues from '@models/YesNoValues';

export default function TriggerType() {
  const [field, , helpers] = useField('triggerType');
  const [startImmediatelyField] = useField({ name: 'startImmediately' });

  return (
    <RadioGroup
      defaultValue="date"
      colorScheme="blue"
      isDisabled={startImmediatelyField.value === YesNoValues.Yes}
      {...field}
      onChange={helpers.setValue}
    >
      <Stack spacing={2} direction="row">
        <Radio size="sm" value={TriggerTypes.Date}>
          <Text textStyle="body-xs">Start based on date</Text>
        </Radio>
        <Radio size="sm" value={TriggerTypes.Price}>
          <Text textStyle="body-xs">Start based on asset price</Text>
        </Radio>
      </Stack>
    </RadioGroup>
  );
}
