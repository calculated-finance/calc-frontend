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
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo from '@utils/getDenomInfo';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { AssetPageStrategyButtons } from '@components/AssetPageStrategyButtons';
import { useWallet } from '@hooks/useWallet';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';
import { InitialDenom } from '@components/InitialDenom';
import { ResultingDenom } from '@components/ResultingDenom';

function DcaIn() {
  const { connected } = useWallet();
  const { actions, state } = useDCAPlusAssetsForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(dcaPlusInSteps);

  const { data: balances } = useBalances();

  const { validate } = useValidation(DcaPlusAssetsFormSchema, { balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
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
              <InitialDenom denomsOut={undefined} />
              <ResultingDenom
                strategyType={StrategyTypes.DCAPlusIn}

                denoms={
                  values.initialDenom
                    ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)).filter(isSupportedDenomForDcaPlus)
                    : []
                } />
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
        strategyType: StrategyTypes.DCAPlusIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaPlusIn,
      }}
    >
      <DcaIn />
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
