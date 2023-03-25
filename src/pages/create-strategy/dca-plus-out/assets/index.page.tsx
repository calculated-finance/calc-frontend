import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import useDcaInForm, { FormNames } from 'src/hooks/useDcaInForm';
import usePairs, {
  isSupportedDenomForDcaPlus,
  uniqueBaseDenoms,
  uniqueBaseDenomsFromQuoteDenom,
  uniqueQuoteDenoms,
  uniqueQuoteDenomsFromBaseDenom,
} from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { useRouter } from 'next/router';
import DCAOutResultingDenom from '@components/DCAOutResultingDenom';
import DCAOutInitialDenom from '@components/DCAOutInitialDenom';
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import { ModalWrapper } from '@components/ModalWrapper';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import { isDenomStable } from '@utils/getDenomInfo';
import { Pool } from '@models/Pair';
import { Denom } from '@models/Denom';
import { WhitelistModal } from '@components/WhitelistModal';
import useWhitelist from '@hooks/useWhitelist';

function getResultingDenoms(pairs: Pool[], initialDenom: Denom | undefined) {
  return Array.from(
    new Set([
      ...uniqueQuoteDenomsFromBaseDenom(initialDenom, pairs),
      ...uniqueBaseDenomsFromQuoteDenom(initialDenom, pairs),
    ]),
  ).filter(isDenomStable);
}

function Page() {
  const { actions, state } = useDcaInForm(FormNames.DcaPlusOut);
  const {
    data: { pairs },
    isLoading,
  } = usePairs();
  const { nextStep } = useSteps(dcaPlusOutSteps);

  const { data } = useBalances();

  const { isPageLoading } = usePageLoad();

  const { validate } = useValidation(DcaPlusAssetsFormSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const router = useRouter();

  const { isWhitelisted } = useWhitelist();

  if (!isWhitelisted) {
    return <WhitelistModal />;
  }

  if (!pairs) {
    return <ModalWrapper stepsConfig={dcaPlusOutSteps} isLoading reset={actions.resetAction} />;
  }
  const denoms = Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).filter(
    isSupportedDenomForDcaPlus,
  );

  const { quote_denom, base_denom } = pairs.find((pair) => pair.address === router.query.pair) || {};
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
          stepsConfig={dcaPlusOutSteps}
          isLoading={isLoading || (isPageLoading && !isSubmitting)}
          reset={actions.resetAction}
        >
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAOutInitialDenom denoms={denoms} />
              <DCAOutResultingDenom denoms={getResultingDenoms(pairs, values.initialDenom)} />
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
