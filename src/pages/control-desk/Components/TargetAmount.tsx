import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { useField, useFormikContext } from 'formik';
import NumberInput from '@components/NumberInput';
import { CtrlFormDataAll } from './ControlDeskForms';

export default function TargetAmount() {
  const {
    values: { resultingDenom },
  } = useFormikContext<CtrlFormDataAll>();

  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'targetAmount' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!resultingDenom}>
      <NumberInput onChange={helpers.setValue} textAlign="right" placeholder="Enter amount" {...field} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}