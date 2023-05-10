import { Button, ButtonProps } from '@chakra-ui/react';
import { useFormikContext } from 'formik';

export default function Submit({
  children,
  disabledUnlessDirty = false,
  ...props
}: ButtonProps & { disabledUnlessDirty?: boolean }) {
  const { isSubmitting, isValid, submitCount, dirty } = useFormikContext();

  return (
    <Button
      type="submit"
      data-testid="submit-button"
      w="full"
      isLoading={isSubmitting}
      isDisabled={(!isValid && Boolean(submitCount)) || (disabledUnlessDirty && !dirty)}
      {...props}
    >
      {children}
    </Button>
  );
}
