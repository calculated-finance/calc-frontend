import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Spinner,
  Stack,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
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
import { Icon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { MdAccessTime } from 'react-icons/md';
import { FaAnglesUp, FaChevronDown, FaChevronUp, FaShieldHalved } from 'react-icons/fa6';
import useTwapToNow from '@hooks/useTwapToNow';
import { max, min } from 'rambda';
import { useCreateStreamingSwap } from '@hooks/useCreateVault/useCreateStreamingSwap';
import { useDebounce } from 'ahooks';
import { ModalWrapper } from '@components/ModalWrapper';
import AdvancedSettingsSwitch from '@components/AdvancedSettingsSwitch';
import { ConnectWalletButton } from '@components/StepOneConnectWallet';
import { SWAP_FEE } from 'src/constants';
import { getPrettyFee } from '@helpers/getPrettyFee';
import useDexFee from '@hooks/useDexFee';
import { FeeBreakdown } from '@components/Fees';
import { Swap2Icon } from '@fusion-icons/react/web3';
import useSpotPrice from '@hooks/useSpotPrice';
import { TransactionType } from './TransactionType';

function InitialDeposit() {
  const {
    values: { initialDenom },
  } = useFormikContext<FormData>();

  const [{ onChange, value, ...field }, meta, helpers] = useField({ name: 'initialDeposit' });

  const initialDenomInfo = getDenomInfo(initialDenom);

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <NumberInput
        onChange={(newValue) => helpers.setValue(newValue && Math.round(initialDenomInfo.toAtomic(newValue)))}
        textAlign="right"
        placeholder="Enter amount"
        value={
          (value &&
            initialDenomInfo &&
            Number(initialDenomInfo.fromAtomic(value)?.toFixed(max(initialDenomInfo.significantFigures, 6)))) ??
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
  const [initialDenom, initialDenomMeta, initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [, , priceThresholdHelpers] = useField({ name: 'priceThreshold' });
  const [resultingDenom, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });
  const [initialDeposit, , initialDepositHelpers] = useField<number>({ name: 'initialDeposit' });
  const [isMobile] = useMediaQuery('(max-width: 506px)');
  const { fiatPrice } = useFiatPrice(getDenomInfo(initialDenom.value));

  useEffect(() => {
    if (!!pairs && !initialDenom.value) {
      const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
      initialDenomHelpers.setValue(randomPair.denoms[0]);
      resultingDenomHelpers.setValue(randomPair.denoms[1]);
    }
  });

  if (!pairs) return null;

  const initialDenomInfo = getDenomInfo(initialDenom.value);

  return (
    <FormControl isInvalid={Boolean(initialDenomMeta.touched && initialDenomMeta.error)}>
      <FormLabel>Swap</FormLabel>
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
              priceThresholdHelpers.setValue('');
              initialDenomHelpers.setValue(newValue);
            }}
          />
          <FormErrorMessage>{initialDenomMeta.touched && initialDenomMeta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
      <FormHelperText textAlign="end">
        <Stack align="end">
          <HStack spacing={1} align="end">
            <Text>USD Value:</Text>
            <Text color="white">
              $
              {(initialDeposit.value && fiatPrice && initialDenomInfo
                ? Number(
                    (initialDenomInfo.fromAtomic(initialDeposit.value) * fiatPrice)?.toFixed(
                      initialDenomInfo.significantFigures / 3,
                    ),
                  )
                : '0.00'
              ).toLocaleString()}
            </Text>
          </HStack>
        </Stack>
      </FormHelperText>
    </FormControl>
  );
}

function SwapDenoms() {
  const [{ value: initialDenomValue }, , initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [{ value: initialDepositValue }, , initialDepositHelpers] = useField({ name: 'initialDeposit' });
  const [{ value: resultingDenomValue }, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });
  const [, priceThresholdMeta, priceThresholdHelpers] = useField({ name: 'priceThreshold' });

  return (
    <Center>
      <Image
        src="/images/arrow-down.svg"
        boxSize={8}
        onClick={
          initialDenomValue &&
          resultingDenomValue &&
          (() => {
            initialDenomHelpers.setValue(resultingDenomValue);
            resultingDenomHelpers.setValue(initialDenomValue);

            if (initialDepositValue && initialDenomValue && resultingDenomValue) {
              initialDepositHelpers.setValue(
                initialDepositValue *
                  10 **
                    (getDenomInfo(resultingDenomValue).significantFigures -
                      getDenomInfo(initialDenomValue).significantFigures),
              );
            }

            if (priceThresholdMeta.touched) priceThresholdHelpers.setTouched(false);
          })
        }
      />
    </Center>
  );
}

function ResultingDenom() {
  const [isMobile] = useMediaQuery('(max-width: 506px)');
  const { pairs } = usePairs();
  const { dexFee } = useDexFee();

  const {
    values: { initialDenom, initialDeposit, swapAmount },
  } = useFormikContext<FormData>();

  const [{ value: resultingDenomValue, ...resultingDenomField }, resultingDenomMeta, resultingDenomHelpers] = useField({
    name: 'resultingDenom',
  });

  const debouncedInitialDeposit = useDebounce(initialDeposit, { wait: 500 });

  const resultingDenomInfo = getDenomInfo(resultingDenomValue);
  const initialDenomInfo = getDenomInfo(initialDenom);

  const { fiatPrice: initialDenomFiatPrice } = useFiatPrice(initialDenomInfo);
  const { fiatPrice: resultingDenomFiatPrice } = useFiatPrice(resultingDenomInfo);

  const { expectedReceiveAmount } = useExpectedReceiveAmount(
    swapAmount && initialDenomInfo ? coin(BigInt(swapAmount).toString(), initialDenomInfo.id) : undefined,
    resultingDenomInfo,
    undefined,
    !!swapAmount && !!resultingDenomInfo,
  );

  const expectedTotalReceiveAmount =
    initialDenomInfo &&
    swapAmount &&
    expectedReceiveAmount &&
    Number(expectedReceiveAmount?.amount) * (debouncedInitialDeposit / swapAmount);

  const totalFee = resultingDenomInfo && expectedTotalReceiveAmount && expectedTotalReceiveAmount * (SWAP_FEE + dexFee);

  const expectedFinalReceiveAmount = expectedTotalReceiveAmount && totalFee && expectedTotalReceiveAmount - totalFee;

  const expectedFinalReceiveAmountFiatValue =
    expectedFinalReceiveAmount &&
    resultingDenomFiatPrice &&
    initialDenomInfo &&
    Number(
      (resultingDenomInfo.fromAtomic(expectedFinalReceiveAmount) * resultingDenomFiatPrice)?.toFixed(
        resultingDenomInfo.significantFigures,
      ),
    );

  const initialDepositFiatValue =
    initialDeposit &&
    initialDenomFiatPrice &&
    initialDenomInfo &&
    Number(
      (initialDenomInfo.fromAtomic(initialDeposit) * initialDenomFiatPrice)?.toFixed(
        initialDenomInfo.significantFigures,
      ),
    );

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
          denoms={pairs && initialDenom ? getResultingDenoms(pairs, getDenomInfo(initialDenom)) : []}
          placeholder={isMobile ? 'Asset' : 'Choose asset'}
          defaultValue={resultingDenomValue}
          value={resultingDenomValue}
          onChange={resultingDenomHelpers.setValue}
        />
        <FormErrorMessage>{resultingDenomMeta.touched && resultingDenomMeta.error}</FormErrorMessage>
        <NumberInput
          textAlign="right"
          isReadOnly
          isDisabled={!expectedFinalReceiveAmount}
          value={
            (initialDeposit &&
              resultingDenomInfo &&
              (expectedFinalReceiveAmount || (expectedFinalReceiveAmount && expectedFinalReceiveAmount === 0)) &&
              Number(
                resultingDenomInfo
                  .fromAtomic(expectedFinalReceiveAmount)
                  ?.toFixed(resultingDenomInfo.significantFigures),
              )) ||
            ''
          }
          {...resultingDenomField}
        />
        <FormErrorMessage>{resultingDenomMeta.touched && resultingDenomMeta.error}</FormErrorMessage>
      </SimpleGrid>
      <FormHelperText textAlign="right">
        <Spacer />
        <Stack spacing={1} alignItems="end" justify="right">
          <HStack spacing={1} align="end">
            <Text>USD Value:</Text>
            {initialDepositFiatValue && expectedFinalReceiveAmountFiatValue ? (
              <Text color="white">${expectedFinalReceiveAmountFiatValue.toLocaleString()}</Text>
            ) : !initialDenom || !resultingDenomValue || !initialDeposit ? (
              <Text color="white">$0.00</Text>
            ) : (
              <Spinner size="xs" />
            )}
          </HStack>
        </Stack>
      </FormHelperText>
      <FormErrorMessage>{resultingDenomMeta.touched && resultingDenomMeta.error}</FormErrorMessage>
    </FormControl>
  );
}

function BuyStrategyInfoModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={6}>
          <Flex
            px={8}
            py={4}
            bg="abyss.200"
            fontSize="sm"
            borderRadius="xl"
            borderWidth={1}
            borderColor="slateGrey"
            w="full"
          >
            <Stack>
              <Text fontWeight={600} textAlign="center">
                What are price optimised swaps?
              </Text>
              <Text textAlign="center">
                Price optimised swaps distribute your market swap over several transactions. This method lessens the
                price impact typically associated with larger orders.
              </Text>
              <Text textAlign="center">
                Unlike standard limit orders, CALC Streaming Swaps allow you to set a price floor or ceiling, providing
                a safeguard against less favorable price shifts, while still giving you the opportunity to capitalize on
                positive market movements.
              </Text>
              <br />
              <Text fontWeight={600} textAlign="center">
                What happens if the price changes?
              </Text>
              <Text textAlign="center">
                If the price goes beyond your specified price threshold, CALC will set a limit order at your price
                threshold price, and the swap will only resume once the order is filled.
              </Text>
              <Text textAlign="center">
                This means that if the strategy finishes, you will receive at least the amount shown. However, if the
                price of the token falls below your price threshold, the strategy will not execute until the price
                recovers (which could be never).
              </Text>
              <Text textAlign="center">
                You can also cancel any active swaps via the strategies tab, which will return any unswapped assets back
                to your wallet.
              </Text>
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AdvancedSettings({ expectedPrice }: { expectedPrice: number | undefined }) {
  const {
    values: { initialDenom, resultingDenom, priceThreshold: pT, slippageTolerance: sT },
  } = useFormikContext<FormData>();

  const [, , slippageToleranceHelpers] = useField<number | undefined>({
    name: 'slippageTolerance',
  });

  const [, priceThresholdMeta, priceThresholdHelpers] = useField<number | undefined>({
    name: 'priceThreshold',
  });

  const [isUsingPriceProtection, setIsUsingPriceProtection] = useState(true);
  const [slippageTolerance, setSlippageTolerance] = useState(2);
  const [priceThreshold, setPriceThreshold] = useState(0.02);

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = getDenomInfo(resultingDenom);

  const transactionType = initialDenomInfo.stable ? TransactionType.Buy : TransactionType.Sell;

  useEffect(() => {
    if (!!expectedPrice && !priceThresholdMeta.touched) {
      priceThresholdHelpers.setValue(
        expectedPrice &&
          expectedPrice * (transactionType === TransactionType.Buy ? 1 - priceThreshold : 1 + priceThreshold),
      );
      priceThresholdHelpers.setTouched(true);
    }
  }, [expectedPrice, priceThresholdMeta.touched, transactionType, priceThreshold]);

  return (
    <Stack>
      <HStack w="full" spacing={0}>
        <Text noOfLines={1} color={!isUsingPriceProtection ? 'white' : 'slateGrey'} fontSize="10">
          Manually set slippage
        </Text>
        <Switch
          marginInline={2}
          size="sm"
          colorScheme="brand"
          isChecked={isUsingPriceProtection}
          onChange={() => {
            if (isUsingPriceProtection) {
              console.log('no price thresh');
              priceThresholdHelpers.setValue(undefined);
              slippageToleranceHelpers.setValue(slippageTolerance);
            } else {
              console.log('no slippage');
              priceThresholdHelpers.setValue(
                expectedPrice &&
                  expectedPrice * (transactionType === TransactionType.Buy ? 1 - priceThreshold : 1 + priceThreshold),
              );
              slippageToleranceHelpers.setValue(undefined);
            }
            setIsUsingPriceProtection(!isUsingPriceProtection);
          }}
        />
        <Text noOfLines={1} color={isUsingPriceProtection ? 'white' : 'slateGrey'} fontSize="10">
          Price protection
        </Text>
        <Spacer />
        {isUsingPriceProtection ? (
          expectedPrice ? (
            <HStack spacing={1}>
              <Text noOfLines={1} textAlign="end" fontSize="11">
                Skip swaps if:
              </Text>
              <Text noOfLines={1} textAlign="end" fontSize="11" color="blue.200">
                {`1 ${
                  (transactionType === TransactionType.Buy ? resultingDenomInfo : initialDenomInfo).name
                } < ${Number(
                  (
                    expectedPrice &&
                    expectedPrice * (transactionType === TransactionType.Buy ? 1 + priceThreshold : 1 - priceThreshold)
                  )?.toFixed(3),
                )} ${(transactionType === TransactionType.Buy ? initialDenomInfo : resultingDenomInfo).name}`}
              </Text>
            </HStack>
          ) : (
            <Spinner size="xs" />
          )
        ) : null}
      </HStack>
      <Box position="relative" borderRadius="16px 4px 4px 16px" border="1px solid" borderColor="abyss.200">
        <HStack w="full" marginBlock={2.5} ml={4}>
          {isUsingPriceProtection ? (
            <Box ml={1}>
              <FaShieldHalved color="slateGray" />
            </Box>
          ) : (
            <Icon as={Swap2Icon} stroke="slateGrey" boxSize={6} />
          )}
          <Text color="slateGrey">{isUsingPriceProtection ? 'Price Protection' : 'Slippage Tolerance'}</Text>
          <Icon as={QuestionOutlineIcon} color="slateGray" />
          <Spacer />
        </HStack>
        <Box position="absolute" w="100px" top={0} right={0} bottom={0} h="full" backgroundColor="abyss.200">
          <HStack h="full" alignItems="center" pr={2} spacing={1}>
            <Stack h="full" spacing={0} justifyContent="center" pb={1}>
              <Button
                h={4}
                variant="unstyled"
                onClick={
                  isUsingPriceProtection
                    ? () => {
                        const value = max(0, priceThreshold + 0.001);
                        setPriceThreshold(value);
                        if (expectedPrice)
                          priceThresholdHelpers.setValue(
                            expectedPrice * (transactionType === TransactionType.Buy ? 1 - value : 1 + value),
                          );
                      }
                    : () => {
                        const value = max(0, slippageTolerance + 0.1);
                        setSlippageTolerance(value);
                        slippageToleranceHelpers.setValue(value);
                      }
                }
              >
                <Icon as={FaChevronUp} color="brand.300" fontSize={10} />
              </Button>
              <Button
                h={4}
                variant="unstyled"
                onClick={
                  isUsingPriceProtection
                    ? () => {
                        const value = max(0, priceThreshold - 0.001);
                        setPriceThreshold(value);
                        if (expectedPrice)
                          priceThresholdHelpers.setValue(
                            expectedPrice * (transactionType === TransactionType.Buy ? 1 - value : 1 + value),
                          );
                      }
                    : () => {
                        const value = max(0, slippageTolerance - 0.1);
                        setSlippageTolerance(value);
                        slippageToleranceHelpers.setValue(value);
                      }
                }
              >
                <Icon as={FaChevronDown} color="brand.300" fontSize={10} />
              </Button>
            </Stack>
            <Spacer />
            <Text fontWeight="700">
              {!isUsingPriceProtection
                ? Number(slippageTolerance.toFixed(2))
                : Number((priceThreshold * 100).toFixed(2))}
            </Text>
            <Text color="slateGrey">%</Text>
          </HStack>
        </Box>
      </Box>
    </Stack>
  );
}

function DurationSlider() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    values: { initialDenom, initialDeposit, resultingDenom },
  } = useFormikContext<FormData>();

  const [sliderValue, setSliderValue] = useState<number>(415);
  const [strategyDuration, setStrategyDuration] = useState<number>(60);
  const [debouncedStrategyDuration, setDebouncedStrategyDuration] = useState<number>(60);
  const [isSliding, setIsSliding] = useState<boolean>(false);

  const [{ value: resultingDenomValue }] = useField({
    name: 'resultingDenom',
  });
  const [{ onChange: onChangeSwapAmount, ...swapAmountField }, , swapAmountHelpers] = useField<number>({
    name: 'swapAmount',
  });
  const [, , executionIntervalIncrementHelpers] = useField<number>({
    name: 'executionIntervalIncrement',
  });
  const [, , routeHelpers] = useField<number>({
    name: 'route',
  });
  const [priceThreshold, priceThresholdMeta, priceThresholdHelpers] = useField<number | undefined>({
    name: 'priceThreshold',
  });
  const [slippageTolerance] = useField<number | undefined>({
    name: 'slippageTolerance',
  });

  const debouncedInitialDeposit = useDebounce(initialDeposit, { wait: 500 });

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = resultingDenom ? getDenomInfo(resultingDenom) : undefined;

  // const { route, ...useRouteHelpers } = useRoute(
  //   swapAmountField.value && initialDenomInfo
  //     ? coin(BigInt(swapAmountField.value).toString(), initialDenomInfo.id)
  //     : undefined,
  //   resultingDenomInfo,
  // );

  // useEffect(() => {
  //   routeHelpers.setValue(route);
  // }, [route]);

  const { route, ...useRouteHelpers } = { route: undefined, isLoading: false };

  const { twap } = useTwapToNow(
    initialDenomInfo,
    resultingDenomInfo,
    route,
    !!resultingDenomInfo && !!initialDenomInfo && !useRouteHelpers.isLoading,
  );
  const { dexFee } = useDexFee();
  const { fiatPrice } = useFiatPrice(initialDenomInfo);

  const transactionType = initialDenomInfo.stable ? TransactionType.Buy : TransactionType.Sell;

  const { spotPrice } = useSpotPrice(
    resultingDenomInfo,
    initialDenomInfo,
    transactionType,
    route,
    !!resultingDenomInfo && !!initialDenomInfo && !useRouteHelpers.isLoading,
  );

  const minimumSwapAmount = fiatPrice && Math.floor(initialDenomInfo.toAtomic(1) * (0.51 / fiatPrice));
  const maximumSwaps = minimumSwapAmount && Math.ceil(debouncedInitialDeposit / minimumSwapAmount);

  const swaps = strategyDuration && maximumSwaps && min(strategyDuration, maximumSwaps);

  const swapAmount =
    swapAmountField.value && initialDenomInfo
      ? coin(BigInt(swapAmountField.value).toString(), initialDenomInfo.id)
      : undefined;

  const { expectedPrice } = useExpectedPrice(
    swapAmount,
    resultingDenomInfo,
    route,
    !!swapAmountField.value && !!resultingDenomInfo && !useRouteHelpers.isLoading,
  );

  const expectedPriceImpact = !twap || !expectedPrice ? null : ((expectedPrice - twap) / twap) * 100;

  const minutes = strategyDuration - 1;
  const hours = Number((minutes / 60).toFixed(1));

  const minValue = 1;
  const maxValue = min(max(maximumSwaps || Infinity, 60), 60 * 48 + 1);

  const { expectedReceiveAmount } = useExpectedReceiveAmount(
    swapAmount,
    resultingDenomInfo,
    route,
    !!swapAmountField.value && !!resultingDenomInfo && !useRouteHelpers.isLoading,
  );

  const { expectedReceiveAmount: directExpectedReceiveAmount } = useExpectedReceiveAmount(
    debouncedInitialDeposit && initialDenomInfo
      ? coin(`${BigInt(debouncedInitialDeposit).toString()}`, initialDenomInfo.id)
      : undefined,
    resultingDenomInfo,
    route,
    !!debouncedInitialDeposit && !!initialDenomInfo && !!resultingDenomInfo && !useRouteHelpers.isLoading,
  );

  const expectedTotalReceiveAmount =
    initialDenomInfo &&
    swapAmountField.value &&
    expectedReceiveAmount &&
    Number(expectedReceiveAmount?.amount) * (debouncedInitialDeposit / swapAmountField.value);

  const totalFee = resultingDenomInfo && expectedTotalReceiveAmount && expectedTotalReceiveAmount * (SWAP_FEE + dexFee);
  const expectedFinalReceiveAmount = expectedTotalReceiveAmount && totalFee && expectedTotalReceiveAmount - totalFee;

  const extraExpectedReceiveAmount =
    !!expectedFinalReceiveAmount &&
    !!directExpectedReceiveAmount &&
    !!resultingDenomInfo &&
    resultingDenomInfo.fromAtomic(max(0, expectedFinalReceiveAmount - Number(directExpectedReceiveAmount.amount)));

  useEffect(() => {
    const minSwapAmount = fiatPrice && Math.floor(initialDenomInfo.toAtomic(1) * (0.51 / fiatPrice));
    const maxSwaps = debouncedInitialDeposit && minSwapAmount && Math.ceil(debouncedInitialDeposit / minSwapAmount);

    const totalSwaps = debouncedStrategyDuration && maxSwaps && min(debouncedStrategyDuration, maxSwaps);
    const newSwapAmount =
      totalSwaps && debouncedInitialDeposit ? Math.ceil(debouncedInitialDeposit / totalSwaps) : undefined;

    if (debouncedStrategyDuration && totalSwaps)
      executionIntervalIncrementHelpers.setValue(Math.floor(debouncedStrategyDuration / totalSwaps));
    if (newSwapAmount || minSwapAmount) swapAmountHelpers.setValue(newSwapAmount ?? minSwapAmount ?? 0);
  }, [debouncedStrategyDuration, debouncedInitialDeposit, initialDenom, resultingDenom]);

  useEffect(() => {
    if (!swapAmountField.value) {
      setDebouncedStrategyDuration(sliderValue);
    }
  }, [initialDenomInfo]);

  const getStrategyDurationFromSlider = (value: number, factor = 0.2) =>
    max(1, Math.round(((factor * value) ** 2 / (factor * maxValue) ** 2) * maxValue));

  return (
    <>
      <FormControl id="swaps">
        <FormLabel>
          Price optimised swap
          <Button variant="link" size="xs" color="slategrey" onClick={onOpen}>
            <Icon as={QuestionOutlineIcon} _hover={{ color: 'blue.200' }} />
          </Button>
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
                setDebouncedStrategyDuration(minValue);
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
                setDebouncedStrategyDuration(maxValue);
              }}
            >
              {maxValue > 59
                ? `${(maxValue / 60).toFixed(0)} ${maxValue / 60 < 2 ? 'hour' : 'hours'}`
                : `${maxValue} minutes`}
            </Button>
          </Center>
        </FormHelperText>
        <Slider
          defaultValue={sliderValue}
          value={sliderValue}
          min={minValue}
          max={maxValue}
          step={1}
          onChangeStart={() => setIsSliding(true)}
          onChange={(value) => {
            setSliderValue(value);
            setStrategyDuration(getStrategyDurationFromSlider(value));
          }}
          onChangeEnd={(value) => {
            setIsSliding(false);
            setStrategyDuration(getStrategyDurationFromSlider(value));
            setDebouncedStrategyDuration(getStrategyDurationFromSlider(value));
          }}
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
              {Number(
                initialDenomInfo
                  .fromAtomic(swaps && debouncedInitialDeposit && Math.ceil(debouncedInitialDeposit / swaps))
                  .toFixed(initialDenomInfo.significantFigures),
              ).toString()}{' '}
              {initialDenomInfo.name}
              {!isSliding && expectedPriceImpact && !useRouteHelpers.isLoading
                ? ` with estimated ${Number(expectedPriceImpact.toFixed(3))}% price impact`
                : ''}
            </Text>
          </FormHelperText>
        )}
      </FormControl>
      <Collapse in={!!swaps && !!debouncedInitialDeposit}>
        <Stack spacing={4}>
          <Box position="relative" borderRadius="lg" p={4}>
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              left={0}
              bg="green.200"
              opacity={0.15}
              borderRadius="lg"
            />
            <Stack spacing={2} align="stretch">
              <HStack justifyContent="space-between">
                <HStack>
                  <Icon color="green.200" as={MdAccessTime} />
                  <Text color="white" fontSize="m" fontWeight={600}>
                    Estimated swap time:
                  </Text>
                </HStack>
                <Text color="white" fontSize="m" fontWeight={600}>
                  {hours >= 1
                    ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
                    : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems="flex-start">
                <HStack alignItems="flex-start">
                  <Icon mt="5px" color="green.200" opacity={1} as={FaAnglesUp} />
                  <Stack spacing={1.5}>
                    <Text color="white" fontSize="m" fontWeight={600}>
                      Increased returns:
                    </Text>
                    <Text fontSize="xs" color="grey" fontWeight={600}>
                      Compared to a single swap.
                    </Text>
                  </Stack>
                </HStack>
                <Stack spacing={0} justifyContent="flex-end">
                  {extraExpectedReceiveAmount ? (
                    <Text
                      color={extraExpectedReceiveAmount && extraExpectedReceiveAmount > 0 ? 'green.200' : 'white'}
                      fontSize="m"
                      fontWeight={600}
                    >
                      +
                      {resultingDenomInfo &&
                        Number(
                          extraExpectedReceiveAmount.toFixed(resultingDenomInfo.significantFigures),
                        ).toLocaleString([], {
                          maximumFractionDigits: resultingDenomInfo.significantFigures,
                        })}{' '}
                      {resultingDenomInfo && resultingDenomInfo.name}
                    </Text>
                  ) : !initialDenom ||
                    !debouncedInitialDeposit ||
                    !resultingDenomValue ||
                    extraExpectedReceiveAmount === 0 ? (
                    <Text fontSize="m" fontWeight={600}>
                      0.00 {resultingDenomInfo?.name ?? ''}
                    </Text>
                  ) : (
                    <Spinner mt={3} mr={3} p={1} />
                  )}
                  <Text
                    opacity={1}
                    color={
                      extraExpectedReceiveAmount && totalFee && extraExpectedReceiveAmount - totalFee > 0
                        ? 'green.200'
                        : 'white'
                    }
                    fontSize="m"
                    fontWeight={600}
                    textAlign="end"
                  >
                    {extraExpectedReceiveAmount
                      ? `(+${
                          expectedFinalReceiveAmount &&
                          directExpectedReceiveAmount &&
                          Number(
                            (
                              100 *
                              ((expectedFinalReceiveAmount - Number(directExpectedReceiveAmount.amount)) /
                                Number(directExpectedReceiveAmount.amount))
                            ).toFixed(2),
                          )
                        }%)`
                      : ''}
                  </Text>
                </Stack>
              </HStack>
            </Stack>
          </Box>
          <AdvancedSettings expectedPrice={expectedPrice} />
        </Stack>
      </Collapse>
      <BuyStrategyInfoModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

function FeeSection() {
  const {
    values: { initialDenom, initialDeposit, resultingDenom, swapAmount },
  } = useFormikContext<FormData>();

  const initialDenomInfo = getDenomInfo(initialDenom);
  const resultingDenomInfo = getDenomInfo(resultingDenom);
  const transactionType = initialDenomInfo.stable ? TransactionType.Buy : TransactionType.Sell;

  const { fiatPrice } = useFiatPrice(initialDenomInfo);
  const { dexFee } = useDexFee(initialDenomInfo, resultingDenomInfo, transactionType);

  return (
    <Collapse in={!!initialDenom && !!initialDeposit && !!resultingDenom && !!swapAmount}>
      <Stack spacing={0}>
        <Text textStyle="body-xs" as="span">
          Estimated fees:
          <Tooltip label={`Standard ${SWAP_FEE * 100}% fee on all streaming swaps.`} placement="top">
            <Text as="span" textColor="white">
              {' '}
              {String.fromCharCode(8275)}
              {getPrettyFee(initialDenomInfo.fromAtomic(initialDeposit), SWAP_FEE + dexFee)} {initialDenomInfo.name}{' '}
              {`(${Number(
                getPrettyFee(initialDenomInfo.fromAtomic(swapAmount), SWAP_FEE + dexFee).toFixed(
                  initialDenomInfo.significantFigures,
                ),
              )} ${initialDenomInfo.name} per swap)`}
            </Text>
          </Tooltip>
        </Text>
        <Box pl={2}>
          <FeeBreakdown
            initialDenom={initialDenomInfo}
            swapAmount={initialDenomInfo.fromAtomic(swapAmount)}
            price={fiatPrice}
            dexFee={dexFee}
            swapFee={SWAP_FEE}
            excludeDepositFee={false}
          />
        </Box>
      </Stack>
    </Collapse>
  );
}

export function Form() {
  const { connected } = useWallet();
  const { nextStep } = useSteps(streamingSwapSteps);
  const { mutate, isError, error, isLoading } = useCreateStreamingSwap();
  const { pairs } = usePairs();
  const { data: balances } = useBalances();
  const { validate } = useValidation(schema, { balances });
  const [, setIsSuccess] = useState(false);

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
              <Stack direction="column" spacing={2} visibility={isLoading ? 'hidden' : 'visible'}>
                <Stack direction="column" spacing={0} visibility={isLoading ? 'hidden' : 'visible'}>
                  <AdvancedSettingsSwitch />
                  <InitialDenom />
                  <SwapDenoms />
                  <ResultingDenom />
                </Stack>
                <DurationSlider />
              </Stack>
              <FeeSection />
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
