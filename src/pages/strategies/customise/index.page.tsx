import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik, FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
import useStrategy from '@hooks/useStrategy';
import { Strategy } from '@models/Strategy';
import usePageLoad from '@hooks/usePageLoad';
import { initialValues as globalInitialValues } from '@models/DcaInFormData';
import { useChainId } from '@hooks/useChainId';
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
import SwapAmount from '@components/SwapAmount';
import BasePrice from '@components/BasePrice';
import useSpotPrice from '@hooks/useSpotPrice';
import { CollapseWithRender } from '@components/CollapseWithRender';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { FormNames } from '@hooks/useFormStore';
import { convertDenomFromCoin } from '@utils/getDenomInfo';
import { StrategyType } from '@models/StrategyType';
import { CustomiseSchema, CustomiseSchemaDca, getCustomiseSchema } from './CustomiseSchemaDca';
import { customiseSteps } from './customiseSteps';
import { getExistingValues } from './getExistingValues';

function CustomiseForm({ strategy, initialValues }: { strategy: Strategy; initialValues: CustomiseSchema }) {
  const { nextStep } = useSteps(customiseSteps);

  const { chainId: chain } = useChainId();

  const { mutate, error, isError, isLoading } = useCustomiseStrategy();

  const { isPageLoading } = usePageLoad();

  const resultingDenom = getStrategyResultingDenom(strategy);
  const initialDenom = getStrategyInitialDenom(strategy);
  const balance = convertDenomFromCoin(strategy.rawData.balance);
  const transactionType = isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell;

  const { spotPrice: price } = useSpotPrice(resultingDenom, initialDenom, transactionType);

  const context = {
    initialDenom,
    swapAmount: getConvertedSwapAmount(strategy),
    resultingDenom,
    transactionType,
    currentPrice: price,
    chain,
  };

  const onSubmit = (values: CustomiseSchemaDca, { setSubmitting }: FormikHelpers<CustomiseSchemaDca>) => {
    const validatedValues = getCustomiseSchema(strategy).cast(values, { stripUnknown: true });
    return mutate(
      { values: validatedValues as CustomiseSchemaDca, strategy, context, initialValues },
      {
        onSuccess: () => {
          nextStep({
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
            <StrategyInfoProvider
              strategyInfo={{
                strategyType: '' as StrategyType,
                transactionType,
                formName: '' as FormNames,
              }}
            >
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
                      <SwapAmount
                        isEdit
                        initialDenom={initialDenom}
                        resultingDenom={resultingDenom}
                        initialDeposit={balance}
                        transactionType={transactionType}
                      />
                    </Stack>
                  )}
                  {isWeightedScale(strategy) && (
                    <Stack spacing={4}>
                      <ExecutionInterval />
                      <SwapMultiplier
                        initialDenom={initialDenom}
                        resultingDenom={resultingDenom}
                        swapAmountInjected={context.swapAmount}
                      />
                      <CollapseWithRender isOpen={values.advancedSettings}>
                        <Stack spacing={4}>
                          <ApplyMultiplier />
                          <BasePrice initialDenom={initialDenom} resultingDenom={resultingDenom} />
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
            </StrategyInfoProvider>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

function Page() {
  const { query } = useRouter();
  const { data: strategy, isLoading } = useStrategy(query?.id as string);
  const { chainId: chain } = useChainId();
  const { address } = useWallet();

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

  const existingValues = getExistingValues(strategy, chain);

  const castValues = {
    ...getCustomiseSchema(strategy).cast(globalInitialValues, { stripUnknown: true }),
    ...getCustomiseSchema(strategy).cast(existingValues, { stripUnknown: true }),
  } as CustomiseSchema;

  return <CustomiseForm strategy={strategy} initialValues={castValues} />;
}

Page.getLayout = getFlowLayout;

export default Page;
