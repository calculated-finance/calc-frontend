import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import { useDcaInForm } from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { AssetPageStrategyButtons } from '@components/AssetsPageAndForm/AssetPageStrategyButtons';
import { ConnectWalletButton } from '@components/StepOneConnectWallet';
import dcaInSteps from '@formConfig/dcaIn';
import { featureFlags } from 'src/constants';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';
import { Assets } from '../../../../components/AssetsPageAndForm';

function DcaIn() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(dcaInSteps);
  const { data: balances } = useBalances();

  const { validate } = useValidation(step1ValidationSchema, { balances });

  const onSubmit = (formData: DcaInFormDataStep1) => {
    actions.updateAction(formData);
    nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={dcaInSteps} reset={actions.resetAction}>
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
        <ModalWrapper reset={actions.resetAction} stepsConfig={dcaInSteps}>
          <AssetPageStrategyButtons />
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom
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
        strategyType: StrategyTypes.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <Assets />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
