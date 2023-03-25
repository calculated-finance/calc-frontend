import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm, { FormNames } from 'src/hooks/useDcaInForm';
import usePools, {
  uniqueBaseDenoms,
  uniqueBaseDenomsFromQuoteDenom,
  uniqueQuoteDenoms,
  uniqueQuoteDenomsFromBaseDenom,
} from '@hooks/usePools';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { useRouter } from 'next/router';
import DCAOutResultingDenom from '@components/DCAOutResultingDenom';
import DCAOutInitialDenom from '@components/DCAOutInitialDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import dcaOutSteps from '@formConfig/dcaOut';
import { isDenomVolatile } from '@utils/getDenomInfo';
import { Pool } from '@models/Pool';
import { Denom } from '@models/Denom';

function getResultingDenoms(pools: Pool[], initialDenom: Denom | undefined) {
  return Array.from(
    new Set([
      ...uniqueQuoteDenomsFromBaseDenom(initialDenom, pools),
      ...uniqueBaseDenomsFromQuoteDenom(initialDenom, pools),
    ]),
  );
}

function Page() {
  const { actions, state } = useDcaInForm(FormNames.DcaOut);
  const {
    data: { pools },
    isLoading,
  } = usePools();
  const { nextStep } = useSteps(dcaOutSteps);

  const { data } = useBalances();

  const { isPageLoading } = usePageLoad();

  const { validate } = useValidation(step1ValidationSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const router = useRouter();

  if (!pools) {
    return <ModalWrapper stepsConfig={dcaOutSteps} isLoading reset={actions.resetAction} />;
  }
  const denoms = Array.from(new Set([...uniqueBaseDenoms(pools), ...uniqueQuoteDenoms(pools)])).filter(isDenomVolatile);

  // calling toString to make this not failing compilation
  const { quote_denom, base_denom } = pools.find((pool) => pool.pool_id.toString() === router.query.pair) || {};
  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom ? state.step1.initialDenom : base_denom,
    resultingDenom: state.step1.resultingDenom ? state.step1.resultingDenom : quote_denom,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting, values }) => (
        <ModalWrapper
          stepsConfig={dcaOutSteps}
          isLoading={isLoading || (isPageLoading && !isSubmitting)}
          reset={actions.resetAction}
        >
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAOutInitialDenom denoms={denoms} />
              <DCAOutResultingDenom denoms={getResultingDenoms(pools, values.initialDenom)} />
              <Submit>Next</Submit>
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
