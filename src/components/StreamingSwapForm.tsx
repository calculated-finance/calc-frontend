import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
  useRadioGroup,
} from '@chakra-ui/react';
import { FormData, initialValues, schema } from 'src/models/StreamingSwapFormData';
import CalcSpinner from '@components/Spinner';
import usePairs, {
  getResultingDenoms,
  orderAlphabetically,
  uniqueBaseDenoms,
  uniqueQuoteDenoms,
} from '@hooks/usePairs';
import { Formik, FormikHelpers, useField, useFormikContext } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import getDenomInfo from '@utils/getDenomInfo';
import { AgreementForm, SummaryAgreementForm } from '@components/Summary/SummaryAgreementForm';
import { useEffect, useState } from 'react';
import { DenomSelect } from '@components/DenomSelect';
import { AvailableFunds } from '@components/AvailableFunds';
import useSteps from '@hooks/useSteps';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { useWallet } from '@hooks/useWallet';
import NumberInput from '@components/NumberInput';
import useFiatPrice from '@hooks/useFiatPrice';
import useExpectedReceiveAmount from '@hooks/useExpectedReceiveAmount';
import { coin } from '@cosmjs/proto-signing';
import useExpectedPrice from '@hooks/useExpectedPrice';
import streamingSwapSteps from '@formConfig/streamingSwap';
import useTwap from '@hooks/useTwap';
import { max, min } from 'rambda';
import { useCreateStreamingSwap } from '@hooks/useCreateVault/useCreateStreamingSwap';
import YesNoValues from '@models/YesNoValues';
import { useDebounce } from 'ahooks';
import { ModalWrapper } from './ModalWrapper';
import { TransactionType } from './TransactionType';
import { CollapseWithRender } from './CollapseWithRender';
import { DenomPriceInput } from './DenomPriceInput';
import { yesNoData } from './PriceThreshold';
import { ConnectWalletButton } from './StepOneConnectWallet';
import RadioCard from './RadioCard';
import Radio from './Radio';

import SlippageTolerance from './SlippageTolerance';

function InitialDeposit() {
  const {
    values: { initialDenom },
  } = useFormikContext<FormData>();

  const [{ onChange, value, ...field }, meta, helpers] = useField({ name: 'initialDeposit' });

  const initialDenomInfo = getDenomInfo(initialDenom);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <NumberInput
        onChange={(newValue) => helpers.setValue(newValue && initialDenomInfo.deconversion(newValue))}
        textAlign="right"
        placeholder="Enter amount"
        value={
          (value &&
            initialDenomInfo &&
            Number(
              initialDenomInfo.conversion(value)?.toFixed(max(initialDenomInfo.significantFigures, 6)),
            ).toString()) ??
          ''
        }
        {...field}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function InitialDenom() {
  const { pairs } = usePairs();
  const [initialDenom, meta, initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [, , priceThresholdValueHelpers] = useField({ name: 'priceThresholdValue' });
  const [resultingDenom, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });
  const [initialDeposit, , initialDepositHelpers] = useField<number>({ name: 'initialDeposit' });
  const [isMobile] = useMediaQuery('(max-width: 506px)');
  const { fiatPrice } = useFiatPrice(getDenomInfo(initialDenom.value));

  if (!pairs) return null;

  const initialDenomInfo = getDenomInfo(initialDenom.value);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Choose asset to send</Text>
          <Spacer />
          {initialDenom.value && <AvailableFunds denom={initialDenomInfo} deconvertValue />}
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <DenomSelect
            denoms={orderAlphabetically(
              Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) =>
                getDenomInfo(denom),
              ),
            )}
            placeholder={isMobile ? 'Asset' : 'Choose asset'}
            value={initialDenom.value}
            onChange={(newValue) => {
              const newDenomInfo = getDenomInfo(newValue);
              const denoms = pairs && newValue ? getResultingDenoms(pairs, newDenomInfo) : [];
              const resultingDenomIsNotAllowed = !denoms.find((d) => d.id === resultingDenom.value);
              if (resultingDenomIsNotAllowed) resultingDenomHelpers.setValue(undefined);
              if (
                initialDeposit.value &&
                initialDenomInfo &&
                newDenomInfo &&
                initialDenomInfo.significantFigures !== newDenomInfo.significantFigures
              ) {
                initialDepositHelpers.setValue(
                  initialDeposit.value * 10 ** (newDenomInfo.significantFigures - initialDenomInfo.significantFigures),
                );
              }
              priceThresholdValueHelpers.setValue('');
              initialDenomHelpers.setValue(newValue);
            }}
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
      <FormHelperText textAlign="end">
        <Stack align="end">
          <HStack spacing={1} align="end">
            <Text>USD Value:</Text>
            <Text color="white">
              $
              {(
                initialDeposit.value &&
                fiatPrice &&
                initialDenomInfo.conversion(initialDeposit.value) * fiatPrice
              )?.toFixed(initialDenomInfo.significantFigures / 3) ?? '0.00'}
            </Text>
          </HStack>
        </Stack>
      </FormHelperText>
    </FormControl>
  );
}

function ResultingDenom() {
  const { pairs } = usePairs();
  const {
    values: { initialDenom, initialDeposit, swapAmount },
  } = useFormikContext<FormData>();

  const debouncedInitialDeposit = useDebounce(initialDeposit, { wait: 500 });

  const [{ value: resultingDenomValue, ...resultingDenomField }, resultingDenomMeta, resultingDenomHelpers] = useField({
    name: 'resultingDenom',
  });

  const resultingDenomInfo = resultingDenomValue && getDenomInfo(resultingDenomValue);
  const initialDenomInfo = getDenomInfo(initialDenom);

  const [isMobile] = useMediaQuery('(max-width: 506px)');

  const { expectedReceiveAmount } = useExpectedReceiveAmount(
    swapAmount && initialDenomInfo ? coin(BigInt(swapAmount).toString(), initialDenomInfo.id) : undefined,
    resultingDenomInfo,
    undefined,
    !!swapAmount && !!resultingDenomInfo,
  );

  const { expectedReceiveAmount: directExpectedReceiveAmount } = useExpectedReceiveAmount(
    debouncedInitialDeposit && initialDenomInfo
      ? coin(`${BigInt(debouncedInitialDeposit).toString()}`, initialDenomInfo.id)
      : undefined,
    resultingDenomInfo,
    undefined,
    !!debouncedInitialDeposit && !!initialDenomInfo && !!resultingDenomInfo,
  );

  const expectedTotalReceiveAmount =
    initialDenomInfo &&
    swapAmount &&
    expectedReceiveAmount &&
    Number(expectedReceiveAmount?.amount) * (debouncedInitialDeposit / swapAmount);

  const denoms = pairs && initialDenom ? getResultingDenoms(pairs, getDenomInfo(initialDenom)) : [];

  const extraExpectedReceiveAmount =
    expectedTotalReceiveAmount &&
    directExpectedReceiveAmount &&
    resultingDenomInfo
      .conversion(max(0, expectedTotalReceiveAmount - Number(directExpectedReceiveAmount.amount)))
      .toFixed(resultingDenomInfo.significantFigures / 3);

  return (
    <FormControl isInvalid={Boolean(resultingDenomMeta.touched && resultingDenomMeta.error)} isDisabled={!initialDenom}>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">Choose asset to receive</Text>
          <Spacer />
          <Text textStyle="body-xs">Receive (Estimated)</Text>
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <DenomSelect
          denoms={denoms}
          placeholder={isMobile ? 'Asset' : 'Choose asset'}
          defaultValue={resultingDenomValue}
          value={resultingDenomValue}
          onChange={resultingDenomHelpers.setValue}
        />
        <FormErrorMessage>{resultingDenomMeta.touched && resultingDenomMeta.error}</FormErrorMessage>
        <NumberInput
          textAlign="right"
          isReadOnly
          isDisabled={!expectedTotalReceiveAmount}
          value={
            (resultingDenomInfo &&
              expectedTotalReceiveAmount &&
              resultingDenomInfo.conversion(expectedTotalReceiveAmount)?.toFixed(2)) ??
            ''
          }
          {...resultingDenomField}
        />
        <FormErrorMessage>{resultingDenomMeta.touched && resultingDenomMeta.error}</FormErrorMessage>
      </SimpleGrid>
      <FormHelperText textAlign="right">
        <Spacer />
        <Stack spacing={1} alignItems="end" justify="right">
          <HStack spacing={1}>
            <Text textStyle="body-xs">Additional compared to direct swap:</Text>
            <Text textStyle="body-xs" color={extraExpectedReceiveAmount > 0 ? 'green.200' : 'white'}>
              {extraExpectedReceiveAmount ? (
                `${extraExpectedReceiveAmount} ${resultingDenomInfo && resultingDenomInfo.name}`
              ) : !initialDenom || !debouncedInitialDeposit || !resultingDenomValue ? (
                `0.00 ${resultingDenomInfo?.name ?? ''}`
              ) : (
                <Spinner size="xs" />
              )}
            </Text>
          </HStack>
        </Stack>
      </FormHelperText>
      <FormErrorMessage>{resultingDenomMeta.touched && resultingDenomMeta.error}</FormErrorMessage>
    </FormControl>
  );
}

function DurationSlider() {
  const {
    values: { initialDenom, initialDeposit, resultingDenom },
  } = useFormikContext<FormData>();

  const [sliderValue, setSliderValue] = useState<number>(60);
  const [strategyDuration, setStrategyDuration] = useState<number>(60);

  const [{ onChange: onChangeSwapAmount, ...swapAmountField }, , swapAmountHelpers] = useField<number>({
    name: 'swapAmount',
  });

  const [, , executionIntervalIncrementHelpers] = useField<number>({
    name: 'executionIntervalIncrement',
  });

  const debouncedInitialDeposit = useDebounce(initialDeposit, { wait: 500 });
  const debouncedSwapAmount = useDebounce(swapAmountField.value, { wait: 500 });

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = resultingDenom ? getDenomInfo(resultingDenom) : undefined;

  const { twap } = useTwap(initialDenomInfo, resultingDenomInfo, undefined, !!resultingDenomInfo && !!initialDenomInfo);
  const { fiatPrice } = useFiatPrice(initialDenomInfo);

  const minimumSwapAmount = fiatPrice && Math.floor(initialDenomInfo.deconversion(1) * (0.51 / fiatPrice));
  const maximumSwaps = minimumSwapAmount && Math.ceil(debouncedInitialDeposit / minimumSwapAmount);

  const swaps = strategyDuration && maximumSwaps && min(strategyDuration, maximumSwaps);

  const { expectedPrice } = useExpectedPrice(
    swapAmountField.value && initialDenomInfo
      ? coin(BigInt(swapAmountField.value).toString(), initialDenomInfo.id)
      : undefined,
    resultingDenomInfo,
    undefined,
    !!debouncedSwapAmount && !!resultingDenomInfo,
  );

  const slippage =
    !twap || !expectedPrice ? null : expectedPrice < twap ? 0 : (Math.abs(expectedPrice - twap) / twap) * 100;

  const minutes = sliderValue - 1;
  const hours = Number((minutes / 60).toFixed(1));

  const minValue = 1;
  const maxValue = min(maximumSwaps || Infinity, 60 * 48 + 1);

  useEffect(() => {
    const minSwapAmount = fiatPrice && Math.floor(initialDenomInfo.deconversion(1) * (0.51 / fiatPrice));
    const maxSwaps = debouncedInitialDeposit && minSwapAmount && Math.ceil(debouncedInitialDeposit / minSwapAmount);

    const totalSwaps = strategyDuration && maxSwaps && min(strategyDuration, maxSwaps);
    const swapAmount =
      totalSwaps && debouncedInitialDeposit ? Math.ceil(debouncedInitialDeposit / totalSwaps) : undefined;

    if (strategyDuration && totalSwaps)
      executionIntervalIncrementHelpers.setValue(Math.floor(strategyDuration / totalSwaps));
    if (swapAmount || minSwapAmount) swapAmountHelpers.setValue(swapAmount ?? minSwapAmount ?? 0);
  }, [strategyDuration, debouncedInitialDeposit, initialDenom, resultingDenom]);

  useEffect(() => {
    if (!swapAmountField.value) {
      setStrategyDuration(sliderValue);
    }
  }, [initialDenomInfo]);

  return (
    <FormControl id="swaps">
      <FormLabel fontWeight={600}>
        Duration:{' '}
        {hours >= 1
          ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
          : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`}
      </FormLabel>
      <FormHelperText>
        <Center>
          <Button
            size="xs"
            colorScheme="blue"
            variant="link"
            cursor="pointer"
            onClick={() => {
              setSliderValue(minValue);
              setStrategyDuration(minValue);
            }}
          >
            Immediate
          </Button>
          <Spacer />
          <Button
            size="xs"
            colorScheme="blue"
            variant="link"
            cursor="pointer"
            onClick={() => {
              setSliderValue(maxValue);
              setStrategyDuration(maxValue);
            }}
          >
            {maxValue > 59 ? `${(maxValue / 60).toFixed(0)} hours` : `${maxValue} minutes`}
          </Button>
        </Center>
      </FormHelperText>
      <Slider
        defaultValue={sliderValue}
        value={sliderValue}
        min={minValue}
        max={maxValue}
        onChange={setSliderValue}
        onChangeEnd={setStrategyDuration}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={4} bg="blue.200" borderWidth={1} zIndex={0} />
      </Slider>
      {!!swaps && !!initialDenom && !!debouncedInitialDeposit && !!resultingDenom && (
        <FormHelperText>
          <Text color="brand.200" fontSize="xs">
            {swaps} {swaps > 1 ? 'swaps' : 'swap'} of{' '}
            {parseFloat(
              initialDenomInfo
                .conversion(Number(swapAmountField.value))
                .toFixed(initialDenomInfo.significantFigures / 3),
            ).toString()}{' '}
            {initialDenomInfo.name} every {Math.ceil(sliderValue / swaps)} minutes, with estimated{' '}
            {slippage ? `${slippage.toFixed(3)}%` : <Spinner size="xs" />} price impact
          </Text>
        </FormHelperText>
      )}
    </FormControl>
  );
}

function SwapDenoms() {
  const [initialDenomValue, , initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [resultingDenomValue, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });

  return (
    <Center>
      <Image
        src="/images/arrow-down.svg"
        boxSize={8}
        onClick={() => {
          initialDenomHelpers.setValue(resultingDenomValue.value);
          resultingDenomHelpers.setValue(initialDenomValue.value);
        }}
      />
    </Center>
  );
}

function PriceThresholdToggle() {
  const {
    values: { initialDenom, resultingDenom },
  } = useFormikContext<FormData>();

  const [field, , helpers] = useField({ name: 'priceThresholdEnabled' });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <HStack>
        <Radio {...getRootProps}>
          {yesNoData.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <RadioCard
                key={option.label}
                isDisabled={!initialDenom || !resultingDenom}
                disabledMessage="Setting price protection requires both assets to be selected."
                {...radio}
              >
                {option.label}
              </RadioCard>
            );
          })}
        </Radio>
      </HStack>
    </FormControl>
  );
}

function PriceThreshold() {
  const {
    values: { initialDenom, resultingDenom },
  } = useFormikContext<FormData>();

  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'priceThresholdValue' });
  const [priceThresholdField] = useField({ name: 'priceThresholdEnabled' });

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = getDenomInfo(resultingDenom);

  const transactionType = initialDenomInfo.stable ? TransactionType.Buy : TransactionType.Sell;

  return (
    <FormControl isInvalid={meta.touched && Boolean(meta.error)}>
      <FormLabel fontWeight={600}>
        {transactionType === TransactionType.Buy ? 'Set buy price protection' : 'Set sell price protection'}
      </FormLabel>
      <FormHelperText>
        {transactionType === TransactionType.Buy
          ? "CALC won't buy if the asset price exceeds this set value."
          : "CALC won't sell if the asset price drops below this set value."}
      </FormHelperText>
      <Stack spacing={3}>
        <PriceThresholdToggle />
        <CollapseWithRender isOpen={priceThresholdField.value === YesNoValues.Yes}>
          <DenomPriceInput
            initialDenom={initialDenomInfo}
            resultingDenom={resultingDenomInfo}
            transactionType={transactionType}
            error={meta.touched && meta.error}
            onChange={helpers.setValue}
            {...field}
          />
        </CollapseWithRender>
      </Stack>
    </FormControl>
  );
}

export function Form() {
  const { connected } = useWallet();
  const { nextStep } = useSteps(streamingSwapSteps);
  const { mutate, isError, error, isLoading } = useCreateStreamingSwap();
  const { pairs } = usePairs();
  const { data: balances } = useBalances();
  const { validate } = useValidation(schema, { balances });
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

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={() => {}}>
      {({ values }) => (
        <ModalWrapper stepsConfig={[streamingSwapSteps[0]]}>
          {!pairs || isLoading ? (
            <Center h={400}>
              <CalcSpinner />
            </Center>
          ) : (
            <Stack direction="column" spacing={4} visibility={isLoading ? 'hidden' : 'visible'}>
              <Stack direction="column" spacing={0} visibility={isLoading ? 'hidden' : 'visible'}>
                <InitialDenom />
                <SwapDenoms />
                <ResultingDenom />
              </Stack>
              <DurationSlider />
              <PriceThreshold />
              <SlippageTolerance />
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
        </ModalWrapper>
      )}
    </Formik>
  );
}
