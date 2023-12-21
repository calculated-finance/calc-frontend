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
import usePairs, { getResultingDenoms, orderAlphabetically } from '@hooks/usePairs';
import { Formik, FormikHelpers, useField, useFormikContext } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import { FormNames } from '@hooks/useFormStore';
import { StrategyType } from '@models/StrategyType';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import simpleDcaInSteps from '@formConfig/simpleDcaIn';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { NewStrategyModalBody } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import * as Sentry from '@sentry/react';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import { useEffect, useState } from 'react';
import { SuccessStrategyModalBody } from '@components/SuccessStrategyModal';
import { DenomSelect } from '@components/DenomSelect';
import { getChainDexName } from '@helpers/chains';
import { useChainId } from '@hooks/useChainId';
import { DenomInfo } from '@utils/DenomInfo';
import { AvailableFunds } from '@components/AvailableFunds';
import InitialDeposit from '@components/InitialDeposit';
import useSteps from '@hooks/useSteps';
import totalExecutions from '@utils/totalExecutions';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { formatFiat } from '@helpers/format/formatFiat';
import { useWallet } from '@hooks/useWallet';
import useDenoms from '@hooks/useDenoms';
import { values } from 'rambda';
import { MINIMUM_SWAP_VALUE_IN_USD } from 'src/constants';
import { useCreateVaultDca } from '@hooks/useCreateVault/useCreateVaultDca';
import ExecutionIntervalLegacy from './ExecutionIntervalLegacy';
import { DenomInput } from './DenomInput';
import { ConnectWalletButton } from './StepOneConnectWallet';

type SimpleDcaModalHeaderProps = {
  isSuccess: boolean;
};

function ModalHeader({ isSuccess }: SimpleDcaModalHeaderProps) {
  return (
    <Heading size="sm">
      {isSuccess ? 'Strategy successfully created!' : 'Setup a simple dollar cost averaging (DCA) strategy'}
    </Heading>
  );
}

function InitialDenom() {
  const { pairs } = usePairs();
  const { getDenomById, denoms } = useDenoms();
  const { chainId } = useChainId();
  const [initialDenom, meta, initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });
  const [isMobile] = useMediaQuery('(max-width: 506px)');

  useEffect(() => {
    if (!!pairs && !initialDenom.value) {
      const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
      initialDenomHelpers.setValue(randomPair.denoms[0]);
      resultingDenomHelpers.setValue(randomPair.denoms[1]);
    }
  });

  if (!pairs) return null;

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Using:</FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Choose stablecoin</Text>
          <Spacer />
          {initialDenom.value && <AvailableFunds denom={initialDenom.value} />}
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <DenomSelect
            denoms={orderAlphabetically(values(denoms?.[chainId] ?? {}))}
            placeholder={isMobile ? 'Asset' : 'Choose asset'}
            defaultValue={initialDenom.value?.id}
            value={initialDenom.value?.id}
            onChange={(newValue) => {
              if (!newValue) return;
              initialDenomHelpers.setValue(getDenomById(newValue));
              resultingDenomHelpers.setValue(undefined);
            }}
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}

function ResultingDenom({ denoms }: { denoms: DenomInfo[] }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });
  const { chainId } = useChainId();
  const { getDenomById } = useDenoms();

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
        defaultValue={field.value?.id}
        value={field.value?.id}
        onChange={(v) => v && helpers.setValue(getDenomById(v))}
        optionLabel={`Swapped on ${getChainDexName(chainId)}`}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function SwapAmount({
  initialDenom,
  resultingDenom,
}: {
  initialDenom: DenomInfo | undefined;
  resultingDenom: DenomInfo | undefined;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: initialDeposit }, depositMeta] = useField({ name: 'initialDeposit' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });

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
      <FormLabel>How much {initialDenom?.name} each purchase?</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenom?.name}.</Text>
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

function Form() {
  const { connected } = useWallet();
  const { nextStep } = useSteps(simpleDcaInSteps);
  const { mutate, isError, error, isLoading } = useCreateVaultDca();
  const { pairs } = usePairs();
  const { balances } = useBalances();
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
      {({ values: formValues }) => (
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
                    <ModalHeader isSuccess={isSuccess} />
                    <InitialDenom />
                    <ResultingDenom
                      denoms={formValues.initialDenom ? getResultingDenoms(pairs, formValues.initialDenom) : []}
                    />
                    <ExecutionIntervalLegacy />
                    <SwapAmount initialDenom={formValues.initialDenom} resultingDenom={formValues.resultingDenom} />
                    {connected ? (
                      <SummaryAgreementForm
                        isError={isError}
                        error={error}
                        onSubmit={(agreementData, setSubmitting) =>
                          handleSubmit(agreementData, setSubmitting, formValues)
                        }
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
        strategyType: StrategyType.SimpleDCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.SimpleDcaIn,
      }}
    >
      <Form />
    </StrategyInfoProvider>
  );
}
