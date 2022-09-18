import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/types/DcaInFormData';
import { useField, useFormikContext } from 'formik';

export default function InitialDeposit() {
  const [field, meta] = useField({ name: 'initialDeposit' });

  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!quoteDenom}>
      <Input type="number" textAlign="right" placeholder="Choose amount" {...field} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
