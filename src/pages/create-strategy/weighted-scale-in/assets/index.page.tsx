import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { FormNames } from 'src/hooks/useFormStore';
import usePairs, {
  isSupportedDenomForWeightedScale,
  orderAlphabetically,
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
import { weightedScaleInSteps } from 'src/formConfig/weightedScaleIn';
import { WeightedScaleAssetsFormSchema } from '@models/weightedScaleFormData';
import { useWeightedScaleAssetsForm } from '@hooks/useWeightedScaleForm';
import { ModalWrapper } from '@components/ModalWrapper';
import { useRouter } from 'next/router';
import { Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';
import getDenomInfo from '@utils/getDenomInfo';

function getResultingDenoms(pairs: Pair[], initialDenom: DenomInfo) {
  return orderAlphabetically(
    Array.from(
      new Set([
        ...uniqueQuoteDenomsFromBaseDenom(initialDenom, pairs),
        ...uniqueBaseDenomsFromQuoteDenom(initialDenom, pairs),
      ]),
    ),
  );
}

function DcaIn() {
  const { actions, state } = useWeightedScaleAssetsForm(FormNames.WeightedScaleIn);
  const {
    data: { pairs },
    isLoading,
  } = usePairs();
  const { nextStep } = useSteps(weightedScaleInSteps);

  const { data } = useBalances();

  const { isPageLoading } = usePageLoad();

  const { validate } = useValidation(WeightedScaleAssetsFormSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const router = useRouter();

  if (!pairs) {
    return <ModalWrapper stepsConfig={weightedScaleInSteps} isLoading reset={actions.resetAction} />;
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
          stepsConfig={weightedScaleInSteps}
        >
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom
                denoms={
                  values.initialDenom
                    ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)).filter(
                        isSupportedDenomForWeightedScale,
                      )
                    : []
                }
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
