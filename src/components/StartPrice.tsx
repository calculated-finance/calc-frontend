import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';
import { DenomPriceInput } from '@components/DenomPriceInput';
import { TransactionType } from '@components/TransactionType';
import { DenomInfo } from '@utils/DenomInfo';
import { useField } from 'formik';

export default function StartPrice({
  transactionType,
  initialDenom,
  resultingDenom,
  route,
}: {
  transactionType: TransactionType;
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  route: string | null | undefined;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'startPrice' });

  return (
    <FormControl mt={3} isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel>Strategy start price</FormLabel>
      <FormHelperText>When this price is hit, your strategy will begin</FormHelperText>
      <DenomPriceInput
        initialDenom={initialDenom}
        resultingDenom={resultingDenom}
        route={route}
        transactionType={transactionType}
        error={meta.touched && meta.error}
        onChange={helpers.setValue}
        {...field}
      />
    </FormControl>
  );
}
