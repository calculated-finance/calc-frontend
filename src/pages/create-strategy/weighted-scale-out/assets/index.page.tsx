import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useDcaInForm } from 'src/hooks/useDcaInForm';
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
import { ConnectWalletButton } from '@components/StepOneConnectWallet';
import { useWallet } from '@hooks/useWallet';
import DCAOutResultingDenom from '@components/DCAOutResultingDenom';
import { featureFlags } from 'src/constants';
import { AssetPageStrategyButtons } from '@components/AssetsPageAndForm/AssetPageStrategyButtons';
import DCAOutInitialDenom from '@components/DCAOutInitialDenom';
import { Assets } from '@components/AssetsPageAndForm';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function WeightedScaleOut() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();

  const { nextStep } = useSteps(weightedScaleOutSteps);
  const { data: balances } = useBalances();
  const { validate } = useValidation(WeightedScaleAssetsFormSchema, { balances });

  const onSubmit = (formData: DcaInFormDataStep1) => {
    actions.updateAction(formData);
    nextStep();
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
              <DCAOutInitialDenom denoms={denoms} />
              <DCAOutResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              {connected ? <Submit>Next</Submit> : <ConnectWalletButton />}
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.WeightedScaleOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.WeightedScaleOut,
      }}
    >
      {featureFlags.singleAssetsEnabled ? <Assets /> : <WeightedScaleOut />}
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
