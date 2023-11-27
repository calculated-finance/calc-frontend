import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useMediaQuery,
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
import simpleDcaInSteps from '@formConfig/simpleDcaIn';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { NewStrategyModalBody } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import * as Sentry from '@sentry/react';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import { useCreateVaultSimpleDcaIn } from '@hooks/useCreateVault/useCreateVaultSimpleDca';
import { useState } from 'react';
import { SuccessStrategyModalBody } from '@components/SuccessStrategyModal';
import { DenomSelect } from '@components/DenomSelect';
import { getChainDexName } from '@helpers/chains';
import { useChainId } from '@hooks/useChainId';
import { DenomInfo } from '@utils/DenomInfo';
import { AvailableFunds } from '@components/AvailableFunds';
import InitialDeposit from '@components/InitialDeposit';
import useSteps from '@hooks/useSteps';
import { useDenom } from '@hooks/useDenom/useDenom';
import totalExecutions from '@utils/totalExecutions';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { formatFiat } from '@helpers/format/formatFiat';
import { useWallet } from '@hooks/useWallet';
import { MINIMUM_SWAP_VALUE_IN_USD } from 'src/constants';
import ExecutionIntervalLegacy from './ExecutionIntervalLegacy';
import { DenomInput } from './DenomInput';
import { ConnectWalletButton } from './StepOneConnectWallet';

type SimpleDcaModalHeaderProps = {
  isSuccess: boolean;
};

function SimpleDcaModalHeader({ isSuccess }: SimpleDcaModalHeaderProps) {
  return (
    <Heading size="sm">
      {isSuccess ? 'Strategy successfully created!' : 'Setup a simple dollar cost averaging (DCA) strategy'}
    </Heading>
  );
}

function SimpleDCAInInitialDenom() {
  const { data } = usePairs();
  const { pairs } = data;
  const [field, meta, helpers] = useField({ name: 'initialDenom' });
  const [isMobile] = useMediaQuery('(max-width: 506px)');

  if (!pairs) return null;

  const denomInfos = Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) =>
    getDenomInfo(denom),
  );

  const denoms = orderAlphabetically(denomInfos.filter(isDenomStable));

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
            placeholder={isMobile ? 'Asset' : 'Choose asset'}
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
  const { chainId } = useChainId();

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
        optionLabel={`Swapped on ${getChainDexName(chainId)}`}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function SimpleDcaInSwapAmount({
  initialDenomString,
  resultingDenomString,
}: {
  initialDenomString: string | undefined;
  resultingDenomString: string | undefined;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: initialDeposit }, depositMeta] = useField({ name: 'initialDeposit' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });

  const initialDenom = useDenom(initialDenomString);
  const resultingDenom = useDenom(resultingDenomString);

  const executions = initialDeposit && field.value ? totalExecutions(initialDeposit, field.value) : 0;
  const displayExecutionInterval =
    executionInterval &&
    executions > 0 &&
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  return (
    <FormControl
      isInvalid={Boolean(meta.touched && meta.error && initialDeposit)}
      isDisabled={!executionInterval || !initialDeposit}
    >
      <FormLabel>How much {initialDenom.name} each purchase?</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenom.name}.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Max:
            </Text>
            <Button
              size="xs"
              colorScheme="blue"
              variant="link"
              cursor="pointer"
              onClick={() => helpers.setValue(initialDeposit)}
            >
              {initialDeposit && !depositMeta.error && depositMeta.touched
                ? initialDeposit?.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 }) ?? '-'
                : '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <DenomInput denom={initialDenom} onChange={helpers.setValue} {...field} isDisabled={!initialDeposit} />
      <FormHelperText>Swap amount must be greater than {formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}</FormHelperText>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {initialDeposit && !depositMeta.error && depositMeta.touched && field.value > 0 && (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      )}
    </FormControl>
  );
}

function SimpleDcaInForm() {
  const { connected } = useWallet();
  const { nextStep } = useSteps(simpleDcaInSteps);
  const { mutate, isError, error, isLoading } = useCreateVaultSimpleDcaIn();
  const {
    data: { pairs },
  } = usePairs();
  const { data: balances } = useBalances();
  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(simplifiedDcaInValidationSchema, { balances });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (_: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>, state: any) =>
    mutate(
      { state },
      {
        onSuccess: async (strategyId) => {
          nextStep({
            strategyId,
            timeSaved: state && getTimeSaved(state.initialDeposit, state.swapAmount),
          });
          setIsSuccess(true);
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
          <Flex layerStyle="panel" p={{ base: 0, sm: 4 }} alignItems="center" justifyContent="center" h="full">
            <Box maxWidth={451} mx="auto">
              <NewStrategyModalBody stepsConfig={simpleDcaInSteps} isLoading={isPageLoading} isSigning={isLoading}>
                {isSuccess ? (
                  <SuccessStrategyModalBody />
                ) : (
                  <Stack direction="column" spacing={4} visibility={isLoading ? 'hidden' : 'visible'}>
                    <SimpleDcaModalHeader isSuccess={isSuccess} />
                    <SimpleDCAInInitialDenom />
                    <SimpleDCAInResultingDenom
                      denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
                    />
                    <ExecutionIntervalLegacy />
                    <SimpleDcaInSwapAmount
                      initialDenomString={values.initialDenom}
                      resultingDenomString={values.resultingDenom}
                    />
                    {connected ? (
                      <SummaryAgreementForm
                        isError={isError}
                        error={error}
                        onSubmit={(agreementData, setSubmitting) => handleSubmit(agreementData, setSubmitting, values)}
                      />
                    ) : (
                      <ConnectWalletButton />
                    )}
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
