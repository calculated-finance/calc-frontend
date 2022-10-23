import { Button, ButtonProps } from '@chakra-ui/react';
import { useFormikContext } from 'formik';

export default function Submit({ children, ...props }: ButtonProps) {
  const { isSubmitting, isValid, submitCount } = useFormikContext();
  return (
    <Button
      type="submit"
      data-testid="submit-button"
      w="full"
      isLoading={isSubmitting}
      isDisabled={!isValid && Boolean(submitCount)}
      {...props}
    >
      {children}
    </Button>
  );
}
