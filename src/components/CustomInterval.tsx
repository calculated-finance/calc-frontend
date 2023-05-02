import { FormControl, FormLabel } from '@chakra-ui/react';
import { useField } from 'formik';
import { featureFlags } from 'src/constants';

export default function CustomInterval() {
  const [field, , helpers] = useField({ name: 'customInterval' });

  return (
    <FormControl>
      {featureFlags.extraTimeOptions ? (
        <FormLabel>How often would you like CALC to swap for you?</FormLabel>
      ) : (
        <FormLabel>How often would you like CALC to purchase for you?</FormLabel>
      )}
    </FormControl>
  );
}
