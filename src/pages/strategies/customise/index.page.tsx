import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik, FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
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
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  isBuyStrategy,
} from '@helpers/strategy';
import { Stack, FormControl, FormErrorMessage, Divider } from '@chakra-ui/react';
import ExecutionInterval from '@components/ExecutionInterval';
import PriceThreshold from '@components/PriceThreshold';
import SlippageTolerance from '@components/SlippageTolerance';
import Submit from '@components/Submit';
import YesNoValues from '@models/YesNoValues';
import DcaDiagram from '@components/DcaDiagram';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { isWeightedScale } from '@helpers/strategy/isWeightedScale';
import SwapMultiplier from '@components/SwapMultiplier';
import ApplyMultiplier from '@components/ApplyMultiplier';
import BasePrice from '@components/BasePrice';
import usePrice from '@hooks/usePrice';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import { CustomiseSchema, CustomiseSchemaDca, getCustomiseSchema } from './CustomiseSchemaDca';
import { customiseSteps } from './customiseSteps';
import { getExistingValues } from './getExistingValues';

function CustomiseForm({ strategy, initialValues }: { strategy: Strategy; initialValues: CustomiseSchema }) {
  const { nextStep } = useSteps(customiseSteps);

  const { mutate, error, isError, isLoading } = useCustomiseStrategy();

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
    const validatedValues = getCustomiseSchema(strategy).cast(values, { stripUnknown: true });
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Formik initialValues={initialValues} validationSchema={getCustomiseSchema(strategy)} onSubmit={onSubmit}>
      {({ values }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={customiseSteps} cancelUrl={generateStrategyDetailUrl(strategy.id)} />
          <NewStrategyModalBody stepsConfig={customiseSteps} isLoading={isPageLoading && !isLoading}>
            <Form autoComplete="off">
              <Stack spacing={4}>
                <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
                <Divider />
                {/* {!isDcaPlus(strategy) && <AdvancedSettingsSwitch />} */}

                {!isDcaPlus(strategy) && !isWeightedScale(strategy) && (
                  <Stack spacing={4}>
                    <ExecutionInterval />
                    <CollapseWithRender isOpen={values.advancedSettings}>
                      <PriceThreshold
                        forceOpen={initialValues.priceThresholdEnabled === YesNoValues.Yes}
                        resultingDenom={resultingDenom}
                        initialDenom={initialDenom}
                        transactionType={transactionType}
                      />
                    </CollapseWithRender>
                  </Stack>
                )}
                {isWeightedScale(strategy) && (
                  <Stack spacing={4}>
                    <ExecutionInterval />
                    <SwapMultiplier
                      initialDenom={initialDenom}
                      resultingDenom={resultingDenom}
                      transactionType={transactionType}
                      swapAmountInjected={context.swapAmount}
                    />
                    <CollapseWithRender isOpen={values.advancedSettings}>
                      <Stack spacing={4}>
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
                      </Stack>
                    </CollapseWithRender>
                  </Stack>
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
        <NewStrategyModalHeader
          stepsConfig={customiseSteps}
          showStepper={false}
          cancelUrl={generateStrategyDetailUrl(query?.id)}
        />

        <NewStrategyModalBody stepsConfig={customiseSteps} isLoading={isLoading}>
          Loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const existingValues = getExistingValues(strategy);

  const castValues = {
    ...getCustomiseSchema(strategy).cast(globalInitialValues, { stripUnknown: true }),
    ...getCustomiseSchema(strategy).cast(existingValues, { stripUnknown: true }),
  } as CustomiseSchema;

  return <CustomiseForm strategy={strategy} initialValues={castValues} />;
}

Page.getLayout = getFlowLayout;

export default Page;
