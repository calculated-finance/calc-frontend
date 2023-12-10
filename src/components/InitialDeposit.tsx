import { FormControl, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import NumberInput from '@components/NumberInput';

export default function InitialDeposit() {
  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'initialDeposit' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <NumberInput onChange={helpers.setValue} textAlign="right" placeholder="Enter amount" {...field} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
