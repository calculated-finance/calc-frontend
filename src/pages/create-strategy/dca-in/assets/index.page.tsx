import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm, { FormNames } from 'src/hooks/useDcaInForm';
import usePools, { uniqueBaseDenomsFromQuoteDenom } from '@hooks/usePools';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import useBalances from '@hooks/useBalances';
import { useRouter } from 'next/router';
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import { ModalWrapper } from '@components/ModalWrapper';

function DcaIn() {
  const { actions, state } = useDcaInForm(FormNames.DcaIn);
  const {
    data: { pools },
    isLoading,
  } = usePools();
  const { nextStep } = useSteps(steps);

  const { data } = useBalances();

  const { isPageLoading } = usePageLoad();

  const { validate } = useValidation(step1ValidationSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const router = useRouter();

  if (!pools) {
    return <ModalWrapper stepsConfig={steps} isLoading reset={actions.resetAction} />;
  }

  // calling toString to make this not failing compilation
  const { quote_denom, base_denom } = pools.find((pool) => pool.pool_id.toString() === router.query.pair) || {};
  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom ? state.step1.initialDenom : quote_denom,
    resultingDenom: state.step1.resultingDenom ? state.step1.resultingDenom : base_denom,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting, values }) => (
        <ModalWrapper
          isLoading={isLoading || (isPageLoading && !isSubmitting)}
          reset={actions.resetAction}
          stepsConfig={steps}
        >
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom denoms={uniqueBaseDenomsFromQuoteDenom(values.initialDenom, pools)} />
              <Submit>Next</Submit>
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
