import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useField } from 'formik';
import { FiCalendar } from 'react-icons/fi';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EndDate() {
  const [field, meta, helpers] = useField({ name: 'endDate' });
  const [advancedSettingsField] = useField({ name: 'advancedSettings' });

  const date = field.value ? new Date(field.value) : undefined;

  const minDate = advancedSettingsField.value ? new Date(new Date().setDate(new Date().getDate() - 1)) : new Date();

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>What date do you want the target amount by?</FormLabel>
      <FormHelperText>This will be the day the strategy aims to finish swapping.</FormHelperText>
      <InputGroup>
        <InputLeftElement
          children={
            <HStack direction="row" ml={10}>
              <FiCalendar /> <Text fontSize="sm">Date</Text>
            </HStack>
          }
        />
        <SingleDatepicker
          usePortal
          name={field.name}
          date={date}
          onDateChange={helpers.setValue}
          minDate={minDate}
          configs={{
            monthNames,
            dayNames,
            dateFormat: 'dd MMM yyyy',
          }}
          propsConfigs={{
            inputProps: {
              placeholder: 'Select a date',
              textAlign: 'right',
            },
          }}
        />
      </InputGroup>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
