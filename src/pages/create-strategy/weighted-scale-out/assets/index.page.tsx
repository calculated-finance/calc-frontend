import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, {
  getResultingDenoms,
  orderAlphabetically,
  uniqueBaseDenoms,
  uniqueQuoteDenoms,
} from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { useRouter } from 'next/router';
import DCAOutResultingDenom from '@components/DCAOutResultingDenom';
import DCAOutInitialDenom from '@components/DCAOutInitialDenom';
import { WeightedScaleAssetsFormSchema } from '@models/weightedScaleFormData';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import getDenomInfo from '@utils/getDenomInfo';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';
import { getPairAddress } from 'src/fixtures/addresses';

function Page() {
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(weightedScaleOutSteps);

  const { data } = useBalances();

  const { validate } = useValidation(WeightedScaleAssetsFormSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const router = useRouter();

  if (!pairs) {
    return <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={actions.resetAction} />;
  }
  const denoms = orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) => getDenomInfo(denom)),
  );

  const pair = pairs.find((p) => {
    const pairAddress = getPairAddress(p.denoms[0], p.denoms[1]);
    return Boolean(pairAddress) && pairAddress === router.query.pair;
  });

  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom ? state.step1.initialDenom : pair?.denoms[1],
    resultingDenom: state.step1.resultingDenom ? state.step1.resultingDenom : pair?.denoms[0],
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={actions.resetAction}>
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAOutInitialDenom denoms={denoms} />
              <DCAOutResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              <Submit>Next</Submit>
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

function PageWrapper() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >
      <Page />
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
