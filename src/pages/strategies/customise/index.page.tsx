import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik, FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
import { StepConfig } from 'src/formConfig/StepConfig';
import useStrategy from '@hooks/useStrategy';
import { Strategy } from '@hooks/useStrategies';
import usePageLoad from '@hooks/usePageLoad';
import { initialValues as globalInitialValues } from '@models/DcaInFormData';
import { useChain } from '@hooks/useChain';
import { useWallet } from '@hooks/useWallet';
import { TransactionType } from '@components/TransactionType';
import { useCustomiseStrategy } from '@hooks/useCustomiseStrategy';
import {
  getConvertedSwapAmount,
  getPriceCeilingFloor,
  getStrategyExecutionInterval,
  getStrategyExecutionIntervalData,
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategySlippageTolerance,
  isBuyStrategy,
} from '@helpers/strategy';
import { Stack, FormControl, FormErrorMessage, Divider } from '@chakra-ui/react';
import ExecutionInterval from '@components/ExecutionInterval';
import PriceThreshold from '@components/PriceThreshold';
import SlippageTolerance from '@components/SlippageTolerance';
import Submit from '@components/Submit';
import YesNoValues from '@models/YesNoValues';
import { getExecutionInterval } from '@hooks/useCreateVault/buildCreateVaultParams';
import DcaDiagram from '@components/DcaDiagram';
import { CustomiseSchemaDca, customiseSchemaDca } from './CustomiseSchemaDca';

export const configureSteps: StepConfig[] = [
  {
    href: '/strategies/customise',
    title: 'Customise Strategy',
  },
  {
    href: '/strategies/customise/success',
    title: 'Customise Successful',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

function CustomiseForm({ strategy, initialValues }: { strategy: Strategy; initialValues: CustomiseSchemaDca }) {
  const { nextStep } = useSteps(configureSteps);

  const { mutate, error, isError, isLoading } = useCustomiseStrategy();

  const validationSchema = customiseSchemaDca;
  const { isPageLoading } = usePageLoad();

  const resultingDenom = getStrategyResultingDenom(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);

  const transactionType = isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell;

  const context = {
    initialDenom,
    swapAmount: getConvertedSwapAmount(strategy),
    resultingDenom,
    transactionType,
  };

  const onSubmit = (values: CustomiseSchemaDca, { setSubmitting }: FormikHelpers<CustomiseSchemaDca>) => {
    const validatedValues = customiseSchemaDca.cast(values, { stripUnknown: true });
    return mutate(
      { values: validatedValues as CustomiseSchemaDca, strategy, context, initialValues },
      {
        onSuccess: async () => {
          await nextStep({
            strategyId: strategy.id,
          });
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={configureSteps} />
        <NewStrategyModalBody stepsConfig={configureSteps} isLoading={isPageLoading && !isLoading}>
          <Form autoComplete="off">
            <Stack direction="column" spacing={4}>
              <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
              <Divider />
              <ExecutionInterval />
              <PriceThreshold
                forceOpen={initialValues.priceThresholdEnabled === YesNoValues.Yes}
                resultingDenom={resultingDenom}
                initialDenom={initialDenom}
                transactionType={transactionType}
              />
              <SlippageTolerance />
              <FormControl isInvalid={isError}>
                <Submit disabledUnlessDirty>Confirm</Submit>
                <FormErrorMessage>Failed to update strategy (Reason: {error?.message})</FormErrorMessage>
              </FormControl>
            </Stack>
          </Form>
        </NewStrategyModalBody>
      </NewStrategyModal>
    </Formik>
  );
}

function Page() {
  const { query } = useRouter();
  const { data, isLoading } = useStrategy(query?.id as string);
  const { chain } = useChain();
  const { address } = useWallet();

  const { vault: strategy } = data || {};

  if (!strategy || !chain || !address) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={configureSteps} showStepper={false} />

        <NewStrategyModalBody stepsConfig={configureSteps} isLoading={isLoading}>
          Loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const priceThreshold = getPriceCeilingFloor(strategy);

  const { timeIncrement, timeInterval } = getStrategyExecutionIntervalData(strategy);

  const existingValues = {
    advancedSettings: true,
    executionInterval: timeInterval,
    executionIntervalIncrement: timeIncrement || 1,
    slippageTolerance: getStrategySlippageTolerance(strategy),
    priceThresholdEnabled: priceThreshold ? YesNoValues.Yes : YesNoValues.No,
    priceThresholdValue: priceThreshold,
  };

  const castValues = {
    ...customiseSchemaDca.cast(globalInitialValues, { stripUnknown: true }),
    ...customiseSchemaDca.cast(existingValues, { stripUnknown: true }),
  } as CustomiseSchemaDca;

  return <CustomiseForm strategy={strategy} initialValues={castValues} />;
}

Page.getLayout = getFlowLayout;

export default Page;
