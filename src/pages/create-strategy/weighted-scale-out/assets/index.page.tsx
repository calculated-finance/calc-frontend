import { Center, Stack } from '@chakra-ui/react';
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
import { WeightedScaleAssetsFormSchema } from '@models/weightedScaleFormData';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import getDenomInfo from '@utils/getDenomInfo';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { AssetPageStrategyButtons } from '@components/AssetPageStrategyButtons';
import { useWallet } from '@hooks/useWallet';
import { InitialDenom } from '@components/InitialDenom';
import { ResultingDenom } from '@components/ResultingDenom';
import { featureFlags } from 'src/constants';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';
import { Assets } from '../../assets/Assets';

function Page() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(weightedScaleOutSteps);

  const { data: balances } = useBalances();

  const { validate } = useValidation(WeightedScaleAssetsFormSchema, { balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }
  const denoms = orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) => getDenomInfo(denom)),
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
        <ModalWrapper stepsConfig={weightedScaleOutSteps} reset={actions.resetAction}>
          <AssetPageStrategyButtons />
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <InitialDenom denomsOut={denoms} />
              <ResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []} strategyType={StrategyTypes.WeightedScaleOut}
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
        strategyType: StrategyTypes.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >

      {featureFlags.singleAssetsEnabled ?

        <Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />
        :
        <Page />
      }

    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
