import { Center, Stack } from '@chakra-ui/react';
import { initialValues, simplifiedDcaInValidationSchema } from 'src/models/DcaInFormData';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import steps from '@formConfig/dcaIn';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import SwapAmountLegacy from '@components/SwapAmountLegacy';
import NewStrategyModal, { NewStrategyModalBody } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import DCAInInitialDenomSimplified from '@components/DCAinInitialDenomSimplified';
import DCAInResultingDenomSimplified from '@components/DCAInResultingDenomSimplified';
import ExecutionIntervalLegacy from '@components/ExecutionIntervalLegacy';
import { SimpleDcaModalHeader } from './simpleComponents/SimpleDcaModalHeader';
import { useConfirmFormSimple } from './useDcaInFormSimple';
import SimpleAgreementForm from './simpleComponents/SimpleAgreementForm';

function DcaIn() {
  const { actions } = useConfirmFormSimple();
  const {
    data: { pairs },
  } = usePairs();

  const { data: balances } = useBalances();
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(simplifiedDcaInValidationSchema, { balances });

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }

  const initialValuesSimple = {
    initialDenom: initialValues.initialDenom,
    resultingDenom: initialValues.resultingDenom,
    initialDeposit: initialValues.initialDeposit,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValuesSimple} validate={validate}>
      {({ values }) => (
        <NewStrategyModal>
          <SimpleDcaModalHeader />
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading}>
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenomSimplified />
              <DCAInResultingDenomSimplified
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              <ExecutionIntervalLegacy />
              <SwapAmountLegacy
                initialDenomString={initialValues.initialDenom}
                resultingDenomString={initialValues.resultingDenom}
              />
              <SimpleAgreementForm />
            </Stack>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

function SimpleDca() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <DcaIn />
    </StrategyInfoProvider>
  );
}

export default SimpleDca;
