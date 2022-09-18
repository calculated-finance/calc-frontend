import { Button } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/types/DcaInFormData';
import { useFormikContext } from 'formik';

export default function Submit() {
  const { isSubmitting, isValid } = useFormikContext<DcaInFormDataStep1>();
  return (
    <Button isDisabled={!isValid} isLoading={isSubmitting} type="submit" w="full">
      Submit
    </Button>
  );
}
