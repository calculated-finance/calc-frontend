import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Radio,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useRadioGroup,
} from '@chakra-ui/react';
import { DcaInFormDataStep1, initialValues, simplifiedDcaInValidationSchema } from 'src/models/DcaInFormData';
import usePairs, {
  getResultingDenoms,
  orderAlphabetically,
  uniqueBaseDenoms,
  uniqueQuoteDenoms,
} from '@hooks/usePairs';
import { Formik, FormikHelpers, useField, useFormikContext } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo, { isDenomStable } from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import steps from '@formConfig/simpleDcaIn';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import SwapAmountLegacy from '@components/SwapAmountLegacy';
import { NewStrategyModalBody } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import * as Sentry from '@sentry/react';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import { useCreateVaultSimpleDcaIn } from '@hooks/useCreateVault/useCreateVaultSimpleDca';
import { useState } from 'react';
import { SuccessStrategyModalBody } from '@components/SuccessStrategyModal';
import RadioCard from '@components/RadioCard';
import { executionIntervalData } from '@helpers/executionIntervalData';
import { DenomSelect } from '@components/DenomSelect';
import { getChainDexName } from '@helpers/chains';
import { useChain } from '@hooks/useChain';
import { DenomInfo } from '@utils/DenomInfo';
import { AvailableFunds } from '@components/AvailableFunds';
import InitialDeposit from '@components/InitialDeposit';
import ExecutionIntervalLegacy from './ExecutionIntervalLegacy';
import useSteps from '@hooks/useSteps';

type SimpleDcaModalHeaderProps = {
  isSuccess: boolean;
};

function SimpleDcaModalHeader({ isSuccess }: SimpleDcaModalHeaderProps) {
  return (
    <Flex
      bg="darkGrey"
      h={20}
      px={6}
      alignItems="center"
      borderRadius="2xl"
      mb={2}
      boxShadow="deepHorizon"
      data-testid="strategy-modal-header"
    >
      <Heading size="sm">
        {isSuccess ? 'Strategy successfully created!' : 'Setup a simple dollar cost averaging (DCA) strategy'}
      </Heading>
      <Spacer />
    </Flex>
  );
}

function SimpleDCAInInitialDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

  if (!pairs) {
    return null;
  }

  const denoms = orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
      .map((denom) => getDenomInfo(denom))
      .filter(isDenomStable),
  );

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Using:</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Choose stablecoin</Text>
          <Spacer />
          {field.value && <AvailableFunds denom={getDenomInfo(field.value)} />}
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <DenomSelect
            denoms={denoms}
            placeholder="Choose&nbsp;asset"
            value={field.value}
            onChange={helpers.setValue}
            showPromotion
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}

function SimpleDCAInResultingDenom({ denoms }: { denoms: DenomInfo[] }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });
  const { chain } = useChain();

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>I want to DCA into:</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
      </FormHelperText>
      <DenomSelect
        denoms={denoms}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        optionLabel={`Swapped on ${getChainDexName(chain)}`}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function SimpleDcaInForm() {
  const { nextStep } = useSteps(steps);
  const { mutate, isError, error, isLoading } = useCreateVaultSimpleDcaIn();
  const {
    data: { pairs },
  } = usePairs();
  const { data: balances } = useBalances();
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(simplifiedDcaInValidationSchema, { balances });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAgreement = (_: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>, values: any) =>
    mutate(
      { state: values },
      {
        onSuccess: async (__) => {
          setIsSuccess(true);
          nextStep();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );

  if (!pairs) {
    return (
      <Center h={56}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={() => {}}>
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
          <Flex layerStyle="panel" p={8} alignItems="center" h="full">
            <Box maxWidth={451} mx="auto">
              <SimpleDcaModalHeader isSuccess={isSuccess} />
              <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading} isSigning={isLoading}>
                {isSuccess ? (
                  <SuccessStrategyModalBody />
                ) : (
                  <Stack direction="column" spacing={6} visibility={isLoading ? 'hidden' : 'visible'}>
                    <SimpleDCAInInitialDenom />
                    <SimpleDCAInResultingDenom
                      denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
                    />
                    <ExecutionIntervalLegacy />
                    <SwapAmountLegacy
                      initialDenomString={values.initialDenom}
                      resultingDenomString={values.resultingDenom}
                    />
                    <SummaryAgreementForm
                      isError={isError}
                      error={error}
                      onSubmit={(agreementData, setSubmitting) => handleAgreement(agreementData, setSubmitting, values)}
                    />
                  </Stack>
                )}
              </NewStrategyModalBody>
            </Box>
          </Flex>
        </Sentry.ErrorBoundary>
      )}
    </Formik>
  );
}

export default function SimpleDcaIn() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.SimpleDCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.SimpleDcaIn,
      }}
    >
      <SimpleDcaInForm />
    </StrategyInfoProvider>
  );
}
