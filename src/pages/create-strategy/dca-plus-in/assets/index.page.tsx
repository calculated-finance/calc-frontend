import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { FormNames } from 'src/hooks/useFormStore';
import usePairs, { getResultingDenoms, isSupportedDenomForDcaPlus } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo from '@utils/getDenomInfo';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { ConnectWalletButton } from '@components/StepOneConnectWallet';
import { useWallet } from '@hooks/useWallet';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import { AssetPageStrategyButtons } from '@components/AssetsPageAndForm/AssetPageStrategyButtons';
import { featureFlags } from 'src/constants';
import { Assets } from '@components/AssetsPageAndForm';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

function DcaPlusIn() {
  const { connected } = useWallet();
  const { actions, state } = useDCAPlusAssetsForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(dcaPlusInSteps);

  const { data: balances } = useBalances();

  const { validate } = useValidation(DcaPlusAssetsFormSchema, { balances });

  const onSubmit = (formData: DcaInFormDataStep1) => {
    actions.updateAction(formData);
    nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={dcaPlusInSteps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }

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
        <ModalWrapper reset={actions.resetAction} stepsConfig={dcaPlusInSteps}>
          <AssetPageStrategyButtons />

          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom
                denoms={
                  values.initialDenom
                    ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)).filter(isSupportedDenomForDcaPlus)
                    : []
                }
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
        strategyType: StrategyTypes.DCAPlusIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaPlusIn,
      }}
    >
      {featureFlags.singleAssetsEnabled ? <Assets /> : <DcaPlusIn />}
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
