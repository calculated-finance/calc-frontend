import { Button, FormControl } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { DcaInFormDataStep2 } from '../../../../types/DcaInFormData';

export default function Submit() {
  const { isSubmitting, isValid, submitCount } = useFormikContext<DcaInFormDataStep2>();

  return (
    <FormControl>
      <Button type="submit" w="full" isLoading={isSubmitting} isDisabled={!isValid && Boolean(submitCount)}>
        Next
      </Button>
    </FormControl>
  );
}
