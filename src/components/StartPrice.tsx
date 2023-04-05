import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';
import { DenomPriceInput } from '@components/DenomPriceInput';
import { TransactionType } from '@components/TransactionType';
import { FormNames, useStep2Form } from '@hooks/useDcaInForm';
import { useField } from 'formik';

export default function StartPrice({
  formName,
  transactionType,
}: {
  formName: FormNames;
  transactionType: TransactionType;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'startPrice' });
  const { state } = useStep2Form(formName);

  if (!state) {
    return null;
  }

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Strategy start price</FormLabel>
      <FormHelperText>When this price is hit, your strategy will begin</FormHelperText>
      <DenomPriceInput
        initialDenom={state.step1.initialDenom}
        resultingDenom={state.step1.resultingDenom}
        transactionType={transactionType}
        error={meta.touched && meta.error}
        onChange={helpers.setValue}
        {...field}
      />
    </FormControl>
  );
}
