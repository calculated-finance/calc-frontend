import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { FormNames } from 'src/hooks/useFormStore';
import usePairs, {
  isSupportedDenomForDcaPlus,
  uniqueBaseDenomsFromQuoteDenom,
  uniqueQuoteDenomsFromBaseDenom,
} from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
import { ModalWrapper } from '@components/ModalWrapper';
import useWhitelist from '@hooks/useWhitelist';
import { WhitelistModal } from '@components/WhitelistModal';
import { useRouter } from 'next/router';
import { Denom } from '@models/Denom';
import { Pair } from '@models/Pair';

function getResultingDenoms(pairs: Pair[], initialDenom: Denom | undefined) {
  return Array.from(
    new Set([
      ...uniqueQuoteDenomsFromBaseDenom(initialDenom, pairs),
      ...uniqueBaseDenomsFromQuoteDenom(initialDenom, pairs),
    ]),
  );
}

function DcaIn() {
  const { actions, state } = useDCAPlusAssetsForm(FormNames.DcaPlusIn);
  const {
    data: { pairs },
    isLoading,
  } = usePairs();
  const { nextStep } = useSteps(dcaPlusInSteps);

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
    return <ModalWrapper stepsConfig={dcaPlusInSteps} isLoading reset={actions.resetAction} />;
  }

  const { quote_denom, base_denom } =
    pairs.find((pair) => Boolean(pair.address) && pair.address === router.query.pair) || {};
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
          stepsConfig={dcaPlusInSteps}
        >
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom
                denoms={getResultingDenoms(pairs, values.initialDenom).filter(isSupportedDenomForDcaPlus)}
              />
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
