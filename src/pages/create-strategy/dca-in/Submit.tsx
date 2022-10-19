import { Button } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/types/DcaInFormData';
import { useFormikContext } from 'formik';

export default function Submit() {
  const { isSubmitting, isValid, submitCount } = useFormikContext<DcaInFormDataStep1>();
  return (
    <Button type="submit" w="full" isLoading={isSubmitting} isDisabled={!isValid && Boolean(submitCount)}>
      Next
    </Button>
  );
}
