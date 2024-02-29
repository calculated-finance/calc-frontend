import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { useField, useFormikContext } from 'formik';
import NumberInput from '@components/NumberInput';
import { DenomInfo } from '@utils/DenomInfo';
import useQueryState from '@hooks/useQueryState';
import { useEffect } from 'react';
import { fromAtomic, toAtomicBigInt } from '@utils/getDenomInfo';
import { max } from 'rambda';

export default function InitialDeposit() {
  const {
    values: { initialDenom },
  } = useFormikContext<{ initialDenom: DenomInfo | undefined }>();

  const [{ amount }, setQueryState] = useQueryState();
  const [{ onChange, value, ...field }, meta, helpers] = useField({ name: 'initialDeposit' });

  useEffect(() => {
    helpers.setValue(amount);
  }, [amount]);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <NumberInput
        onChange={(newAmount) => {
          setQueryState({
            amount: newAmount && initialDenom && toAtomicBigInt(initialDenom, BigInt(newAmount)).toString(),
          });
        }}
        textAlign="right"
        placeholder="Enter amount"
        value={
          (amount &&
            initialDenom &&
            Number(fromAtomic(initialDenom, amount)?.toFixed(max(initialDenom.significantFigures, 6)))) ??
          ''
        }
        {...field}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
