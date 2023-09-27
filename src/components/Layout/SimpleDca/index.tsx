import { Box, Center, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { SimplifiedDcaInFormData, initialValues, simplifiedDcaInValidationSchema } from 'src/models/DcaInFormData';
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
import { NewStrategyModalBody } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import * as Sentry from '@sentry/react';
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

  const initialValuesSimple = {
    initialDenom: initialValues.initialDenom,
    resultingDenom: initialValues.resultingDenom,
    initialDeposit: initialValues.initialDeposit,
  };
  const onSubmit = async (formData: SimplifiedDcaInFormData) => {
    await actions.updateAction(formData);
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValuesSimple} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <Sentry.ErrorBoundary
          fallback={
            <Center m={8} p={8} flexDirection="column" gap={6}>
              <Heading size="lg">Something went wrong</Heading>
              <Image w={28} h={28} src="/images/notConnected.png" />
              <Text>Please try again in a new session</Text>
            </Center>
          }
        >
          <Box maxWidth={451} minWidth={451}>
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
                <SimpleAgreementForm formikValues={values} />
              </Stack>
            </NewStrategyModalBody>
          </Box>
        </Sentry.ErrorBoundary>
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
