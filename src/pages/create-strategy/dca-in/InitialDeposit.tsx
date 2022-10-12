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

  const [{ value, onChange, ...field }, meta, helpers] = useField({ name: 'initialDeposit' });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const numberValue = e.currentTarget.value;
    helpers.setValue(numberValue === '' ? null : numberValue);
  };

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!quoteDenom}>
      <Input
        type="number"
        onChange={handleChange}
        textAlign="right"
        placeholder="Choose amount"
        value={value === null ? undefined : value}
        {...field}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
