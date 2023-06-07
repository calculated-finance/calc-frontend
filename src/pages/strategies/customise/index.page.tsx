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
  getBasePrice,
  getConvertedSwapAmount,
  getPriceCeilingFloor,
  getSlippageTolerance,
  getStrategyExecutionIntervalData,
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  isBuyStrategy,
} from '@helpers/strategy';
import { Stack, FormControl, FormErrorMessage, Divider, Box } from '@chakra-ui/react';
import ExecutionInterval from '@components/ExecutionInterval';
import PriceThreshold from '@components/PriceThreshold';
import SlippageTolerance from '@components/SlippageTolerance';
import Submit from '@components/Submit';
import YesNoValues from '@models/YesNoValues';
import DcaDiagram from '@components/DcaDiagram';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { getWeightedScaleConfig, isWeightedScale } from '@helpers/strategy/isWeightedScale';
import SwapMultiplier from '@components/SwapMultiplier';
import ApplyMultiplier from '@components/ApplyMultiplier';
import BasePrice from '@components/BasePrice';
import StrategyDuration from '@components/StrategyDuration';
import usePrice from '@hooks/usePrice';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { CollapseWithRender } from '@components/CollapseWithRender';
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

  const { price } = usePrice(resultingDenom, initialDenom, transactionType);

  const context = {
    initialDenom,
    swapAmount: getConvertedSwapAmount(strategy),
    resultingDenom,
    transactionType,
    currentPrice: price,
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
      {({ values }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={configureSteps} />
          <NewStrategyModalBody stepsConfig={configureSteps} isLoading={isPageLoading && !isLoading}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={4}>
                <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
                <Divider />
                {!isDcaPlus(strategy) && <AdvancedSettingsSwitch />}

                {!isDcaPlus(strategy) && !isWeightedScale(strategy) && (
                  <>
                    <ExecutionInterval />
                    <CollapseWithRender isOpen={values.advancedSettings}>
                      <PriceThreshold
                        forceOpen={initialValues.priceThresholdEnabled === YesNoValues.Yes}
                        resultingDenom={resultingDenom}
                        initialDenom={initialDenom}
                        transactionType={transactionType}
                      />
                    </CollapseWithRender>
                  </>
                )}
                {isWeightedScale(strategy) && (
                  <>
                    <ExecutionInterval />
                    <SwapMultiplier
                      initialDenom={initialDenom}
                      resultingDenom={resultingDenom}
                      transactionType={transactionType}
                      swapAmountInjected={context.swapAmount}
                    />
                    <CollapseWithRender isOpen={values.advancedSettings}>
                      <ApplyMultiplier transactionType={transactionType} />
                      <BasePrice
                        initialDenom={initialDenom}
                        resultingDenom={resultingDenom}
                        transactionType={transactionType}
                      />
                      <PriceThreshold
                        forceOpen={initialValues.priceThresholdEnabled === YesNoValues.Yes}
                        resultingDenom={resultingDenom}
                        initialDenom={initialDenom}
                        transactionType={transactionType}
                      />
                    </CollapseWithRender>
                  </>
                )}
                <CollapseWithRender isOpen={values.advancedSettings}>
                  <SlippageTolerance />
                </CollapseWithRender>
                <FormControl isInvalid={isError}>
                  <Submit disabledUnlessDirty>Confirm</Submit>
                  <FormErrorMessage>Failed to update strategy (Reason: {error?.message})</FormErrorMessage>
                </FormControl>
              </Stack>
            </Form>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
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

  const increaseOnly = getWeightedScaleConfig(strategy)?.increase_only;

  const slippageTolerance = getSlippageTolerance(strategy);

  const existingValues = {
    advancedSettings:
      increaseOnly ||
      priceThreshold ||
      isDcaPlus(strategy) ||
      slippageTolerance !== globalInitialValues.slippageTolerance,
    executionInterval: timeInterval,
    executionIntervalIncrement: timeIncrement || 1,
    slippageTolerance,
    priceThresholdEnabled: priceThreshold ? YesNoValues.Yes : YesNoValues.No,
    priceThresholdValue: priceThreshold,
    basePriceIsCurrentPrice: YesNoValues.No,
    basePriceValue: getBasePrice(strategy),
    swapMultiplier: getWeightedScaleConfig(strategy)?.multiplier,
    applyMultiplier: increaseOnly ? YesNoValues.No : YesNoValues.Yes,
  };

  const castValues = {
    ...customiseSchemaDca.cast(globalInitialValues, { stripUnknown: true }),
    ...customiseSchemaDca.cast(existingValues, { stripUnknown: true }),
  } as CustomiseSchemaDca;

  return <CustomiseForm strategy={strategy} initialValues={castValues} />;
}

Page.getLayout = getFlowLayout;

export default Page;
