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
import { useState } from 'react';
import { SuccessStrategyModalBody } from '@components/SuccessStrategyModal';
import { DenomSelect } from '@components/DenomSelect';
import { AvailableFunds } from '@components/AvailableFunds';
import useSteps from '@hooks/useSteps';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { useWallet } from '@hooks/useWallet';
import { useCreateVaultDca } from '@hooks/useCreateVault/useCreateVaultDca';
import NumberInput from '@components/NumberInput';
import useFiatPrice from '@hooks/useFiatPrice';
import useExpectedReceiveAmount from '@hooks/useExpectedReceiveAmount';
import { coin } from '@cosmjs/proto-signing';
import useExpectedPrice from '@hooks/useExpectedPrice';
import { ConnectWalletButton } from './StepOneConnectWallet';
import streamingSwapSteps from '@formConfig/streamingSwap';
import useTwap from '@hooks/useTwap';
import { ModalWrapper } from './ModalWrapper';
import { useDebounce } from 'ahooks';
import { TransactionType } from './TransactionType';
import YesNoValues from '@models/YesNoValues';
import { CollapseWithRender } from './CollapseWithRender';
import { DenomPriceInput } from './DenomPriceInput';
import { yesNoData } from './PriceThreshold';
import RadioCard from './RadioCard';
import Radio from './Radio';

function InitialDeposit() {
  const {
    values: { initialDenom },
  } = useFormikContext<FormData>();

  const [{ onChange, value, ...field }, meta, helpers] = useField({ name: 'initialDeposit' });

  const initialDenomInfo = getDenomInfo(initialDenom);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <NumberInput
        onChange={(v) => helpers.setValue(v && initialDenomInfo.deconversion(v))}
        textAlign="right"
        placeholder="Enter amount"
        value={(value && initialDenomInfo && Number(initialDenomInfo.conversion(value)?.toFixed(2)).toString()) ?? ''}
        {...field}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function InitialDenom() {
  const { pairs } = usePairs();
  const [initialDenom, meta, initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [, , priceThresholdEnabledHelpers] = useField({ name: 'priceThresholdEnabled' });
  const [resultingDenom, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });
  const [initialDeposit] = useField({ name: 'initialDeposit' });
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
          {initialDenom.value && <AvailableFunds denom={initialDenomInfo} />}
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
            onChange={(v) => {
              const denoms = pairs && initialDenom ? getResultingDenoms(pairs, getDenomInfo(v)) : [];
              const resultingDenomIsNotAllowed = !denoms.find((d) => d.id === resultingDenom.value);
              if (resultingDenomIsNotAllowed) resultingDenomHelpers.setValue(undefined);
              priceThresholdEnabledHelpers.setValue(YesNoValues.No);
              initialDenomHelpers.setValue(v);
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
              )?.toFixed(2) ?? '0.00'}
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
    values: { initialDenom, initialDeposit, strategyDuration },
  } = useFormikContext<FormData>();

  const [{ value: resultingDenomValue, ...resultingDenomField }, resultingDenomMeta, resultingDenomHelpers] = useField({
    name: 'resultingDenom',
  });

  const resultingDenomInfo = resultingDenomValue && getDenomInfo(resultingDenomValue);
  const initialDenomInfo = getDenomInfo(initialDenom);

  const [isMobile] = useMediaQuery('(max-width: 506px)');

  const swapAmount = initialDeposit
    ? coin(
        (BigInt(initialDeposit ?? 0) / BigInt(strategyDuration ?? initialValues.strategyDuration)).toString(),
        initialDenomInfo.id,
      )
    : undefined;

  const { expectedReceiveAmount } = useExpectedReceiveAmount(
    swapAmount,
    resultingDenomInfo,
    undefined,
    !!swapAmount && !!resultingDenomInfo,
  );

  const { expectedReceiveAmount: directExpectedReceiveAmount } = useExpectedReceiveAmount(
    coin(`${BigInt(initialDeposit ?? 0).toString()}`, initialDenomInfo.id),
    resultingDenomInfo,
    undefined,
    !!initialDeposit && !!initialDenomInfo && !!resultingDenomInfo,
  );

  const expectedTotalReceiveAmount =
    initialDenomInfo &&
    swapAmount &&
    expectedReceiveAmount &&
    Number(expectedReceiveAmount?.amount) * (initialDeposit / Number(swapAmount?.amount));

  const denoms = pairs && initialDenom ? getResultingDenoms(pairs, getDenomInfo(initialDenom)) : [];

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
          {/* <HStack spacing={1}>
            <Text textStyle="body-xs">USD Value:</Text>
            <Text textStyle="body-xs" color="white">
              {(!initialDeposit || !resultingDenomValue
                ? '$0.00'
                : expectedTotalReceiveAmount &&
                  fiatPrice &&
                  ` $${(expectedTotalReceiveAmount * fiatPrice).toFixed(2)}`) ?? <Spinner size="xs" />}
            </Text>
          </HStack> */}
          <HStack spacing={1}>
            <Text textStyle="body-xs">
              Additional{resultingDenomInfo && ` ${resultingDenomInfo.name}`} compared to direct swap:
            </Text>
            <Text textStyle="body-xs" color="white">
              {expectedTotalReceiveAmount && directExpectedReceiveAmount ? (
                `${resultingDenomInfo
                  .conversion(expectedTotalReceiveAmount - Number(directExpectedReceiveAmount.amount))
                  .toFixed(2)}`
              ) : !initialDenom || !initialDeposit || !resultingDenomValue ? (
                '0.00'
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

  const debouncedInitialDeposit = useDebounce(initialDeposit, { wait: 500 });

  const [sliderValue, setSliderValue] = useState<number>(60);

  const [{ onChange: onChangeStrategyDuration, ...strategyDurationField }, , strategyDurationHelpers] = useField({
    name: 'strategyDuration',
  });

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = resultingDenom ? getDenomInfo(resultingDenom) : undefined;

  const { twap } = useTwap(initialDenomInfo, resultingDenomInfo, undefined, !!resultingDenomInfo && !!initialDenomInfo);

  const swapAmount = debouncedInitialDeposit
    ? coin(
        (BigInt(debouncedInitialDeposit) / BigInt(strategyDurationField.value ?? sliderValue)).toString(),
        initialDenomInfo.id,
      )
    : undefined;

  const { expectedPrice } = useExpectedPrice(
    swapAmount,
    resultingDenomInfo,
    undefined,
    !!swapAmount && !!resultingDenomInfo,
  );

  const slippage =
    !twap || !expectedPrice ? null : expectedPrice < twap ? 0 : (Math.abs(expectedPrice - twap) / twap) * 100;

  const minutes = sliderValue - 1;
  const hours = Number((minutes / 60).toFixed(1));

  const minValue = 1;
  const maxValue = 60 * 12 + 1;

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
              strategyDurationHelpers.setValue(minValue);
            }}
          >
            {minValue - 1} minutes
          </Button>
          <Spacer />
          <Button
            size="xs"
            colorScheme="blue"
            variant="link"
            cursor="pointer"
            onClick={() => {
              setSliderValue(maxValue);
              strategyDurationHelpers.setValue(maxValue);
            }}
          >
            {(maxValue / 60).toFixed(0)} hours
          </Button>
        </Center>
      </FormHelperText>
      <Slider
        defaultValue={sliderValue}
        value={sliderValue}
        min={minValue}
        max={maxValue}
        onChange={setSliderValue}
        onChangeEnd={strategyDurationHelpers.setValue}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={4} bg="blue.200" borderWidth={1} zIndex={0} />
      </Slider>
      {!!initialDenom && !!debouncedInitialDeposit && !!resultingDenom && (
        <FormHelperText>
          <Text color="brand.200" fontSize="xs">
            {strategyDurationField.value} {strategyDurationField.value > 1 ? 'swaps' : 'swap'} of{' '}
            {parseFloat(
              initialDenomInfo.conversion(Math.round(debouncedInitialDeposit / strategyDurationField.value)).toFixed(3),
            ).toString()}{' '}
            {initialDenomInfo.name} with expected {slippage ? `${slippage.toFixed(3)}%` : <Spinner size="xs" />} price
            impact
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
                disabledMessage="We currently do not support the removal of price thresholds, please set a suitably high or low value for your purpose"
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
        {transactionType === TransactionType.Buy ? 'Set buy price protection' : 'Set buy price protection'}
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
  const { mutate, isError, error, isLoading } = useCreateVaultDca();
  const { pairs } = usePairs();
  const { data: balances } = useBalances();
  const { validate } = useValidation(schema, { balances });
  const [isSuccess, setIsSuccess] = useState(false);
  // const { queryParams, updateValues: updateQueryParams } = useQueryParamStore('swaps');

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
    <Formik
      initialValues={{
        ...initialValues,
        // ...queryParams,
      }}
      validate={(x) => {
        // updateQueryParams(x);
        validate(x);
      }}
      onSubmit={() => {}}
    >
      {({ values }) => {
        return (
          <ModalWrapper stepsConfig={streamingSwapSteps}>
            {isSuccess ? (
              <SuccessStrategyModalBody />
            ) : (
              <Stack direction="column" spacing={4} visibility={isLoading ? 'hidden' : 'visible'}>
                <Stack direction="column" spacing={0} visibility={isLoading ? 'hidden' : 'visible'}>
                  <InitialDenom />
                  <SwapDenoms />
                  <ResultingDenom />
                </Stack>
                <DurationSlider />
                <PriceThreshold />
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
        );
      }}
    </Formik>
  );
}
