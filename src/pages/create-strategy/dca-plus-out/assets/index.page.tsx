import { Center, Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, {
  getResultingDenoms,
  isSupportedDenomForDcaPlus,
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
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import dcaPlusOutSteps from '@formConfig/dcaPlusOut';
import getDenomInfo from '@utils/getDenomInfo';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { TransactionType } from '@components/TransactionType';
import { StrategyTypes } from '@models/StrategyTypes';
import React, { Suspense } from 'react';
import Spinner from '@components/Spinner';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { AssetPageStrategyButtons } from '@components/AssetPageStrategyButtons';
import { useWallet } from '@hooks/useWallet';
import { StrategyInfoProvider } from '../../dca-in/customise/useStrategyInfo';

const ModalWrapper = React.lazy(() =>
  import('@components/ModalWrapper').then((module) => ({ default: module.ModalWrapper })),
);

function Page() {
  const { connected } = useWallet();
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(dcaPlusOutSteps);

  const { data: balances } = useBalances();

  const { validate } = useValidation(DcaPlusAssetsFormSchema, { balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <Center h={56}>
        <Spinner />
      </Center>
    );
  }
  const denoms = orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
      .map((denom) => getDenomInfo(denom))
      .filter(isSupportedDenomForDcaPlus),
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
        <>
          <AssetPageStrategyButtons />

          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAOutInitialDenom denoms={denoms} />
              <DCAOutResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}

function PageWrapper() {
  const { resetForm } = useFormStore();

  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAPlusOut,
        transactionType: TransactionType.Sell,
        formName: FormNames.DcaPlusOut,
      }}
    >
      <Suspense>
        <ModalWrapper stepsConfig={dcaPlusOutSteps} reset={resetForm(FormNames.DcaPlusOut)}>
          <Page />
        </ModalWrapper>
      </Suspense>
    </StrategyInfoProvider>
  );
}

PageWrapper.getLayout = getFlowLayout;

export default PageWrapper;
