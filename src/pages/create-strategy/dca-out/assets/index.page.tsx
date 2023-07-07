import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
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
import DCAOutResultingDenom from '@components/DCAOutResultingDenom';
import DCAOutInitialDenom from '@components/DCAOutInitialDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import dcaOutSteps from '@formConfig/dcaOut';
import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { FormNames } from '@hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { useWallet } from '@hooks/useWallet';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import Spinner from '@components/Spinner';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function Page() {
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(dcaOutSteps);
  const { connected } = useWallet();

  const { data: balances } = useBalances();

  const { validate } = useValidation(step1ValidationSchema, { balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={dcaOutSteps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }
  const denoms = orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
      .map((denom) => getDenomInfo(denom))
      .filter(isDenomVolatile),
  );

  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom,
    resultingDenom: state.step1.resultingDenom,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper stepsConfig={dcaOutSteps} reset={actions.resetAction}>
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAOutInitialDenom denoms={denoms} />
              <DCAOutResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
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
        strategyType: StrategyTypes.DCAOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaOut,
      }}
    >
      <Page />
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
