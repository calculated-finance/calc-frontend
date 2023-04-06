import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import getDenomInfo from '@utils/getDenomInfo';
import { Denom } from '@models/Denom';
import { DenomSelect } from './DenomSelect';

export default function DCAOutResultingDenom({ denoms }: { denoms: Denom[] }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const { promotion } = getDenomInfo(field.value);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>How do you want to hold your profits?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">You will have the choice to move these funds into another strategy at the end.</Text>
      </FormHelperText>
      <DenomSelect
        denoms={denoms}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        showPromotion
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      {promotion && <FormHelperText color="blue.200">{promotion}</FormHelperText>}
    </FormControl>
  );
}
