import { Stack } from '@chakra-ui/react';
import { SigningState } from '@components/NewStrategyModal';
import simpleDcaInSteps from '@formConfig/simpleDcaIn';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { useCreateVaultSimpleDca } from '@hooks/useCreateVault/useCreateVaultSimpleDca';
import useDcaInFormSimplified from '@hooks/useDcaInSimplifiedForm';
import useSteps from '@hooks/useSteps';
import { FormikHelpers, useField } from 'formik';
import { AgreementForm, SimpleAgreementForm } from './SimpleAgreementForm';

export function ConfirmSimpleDca() {
  const { state, actions } = useDcaInFormSimplified();

  const [{ value: swapAmount }] = useField({ name: 'swapAmount' });
  const [{ value: initialDeposit }] = useField({ name: 'initialDeposit' });
  const [{ value: initialDenom }] = useField({ name: 'initialDenom' });

  const { nextStep } = useSteps(simpleDcaInSteps);

  const { mutate, isError, error, isLoading } = useCreateVaultSimpleDca(initialDenom);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(
      { state },
      {
        onSuccess: async (strategyId) => {
          await nextStep({
            strategyId,
            timeSaved: state && getTimeSaved(initialDeposit, swapAmount),
          });
          actions.resetAction();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );

  return (
    <SigningState isSigning={isLoading}>
      <Stack spacing={4}>
        <SimpleAgreementForm isError={isError} error={error} onSubmit={handleSubmit} />
      </Stack>
    </SigningState>
  );
}
