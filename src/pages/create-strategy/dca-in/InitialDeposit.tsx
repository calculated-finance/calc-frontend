import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/types/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import useBalance from '@hooks/useBalance';

export default function InitialDeposit() {
  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const { displayAmount } = useBalance({
    token: quoteDenom,
  });

  const validate = (value: number) => {
    if (value > displayAmount) {
      return `Insufficient funds.`;
    }
    return undefined;
  };

  const [field, meta] = useField({ name: 'initialDeposit', validate });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!quoteDenom}>
      <Input type="number" textAlign="right" placeholder="Choose amount" {...field} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
