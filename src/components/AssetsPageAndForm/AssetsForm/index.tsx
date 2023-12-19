import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SimpleGrid,
  Spacer,
  Text,
  Center,
} from '@chakra-ui/react';
import usePairs, { getResultingDenoms, isSupportedDenomForDcaPlus, orderAlphabetically } from '@hooks/usePairs';
import { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useField } from 'formik';
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '@components/InitialDeposit';
import { useChainId } from '@hooks/useChainId';
import { getChainDexName } from '@helpers/chains';
import { StrategyType } from '@models/StrategyType';
import { DenomInfo } from '@utils/DenomInfo';
import useDenoms from '@hooks/useDenoms';
import { HydratedPair } from '@models/Pair';
import Spinner from '@components/Spinner';

function getIsDcaInStrategy(strategyType: string | undefined) {
  const strategy = strategyType && strategyType;
  return [StrategyType.DCAIn, StrategyType.DCAPlusIn, StrategyType.WeightedScaleIn].includes(strategy as StrategyType);
}

function getInitialDenomsFromStrategyType(strategyType: StrategyType | undefined, denoms: DenomInfo[]): DenomInfo[] {
  if (!strategyType || !denoms) {
    return [];
  }

  const isDcaInStrategy = getIsDcaInStrategy(strategyType);

  if (isDcaInStrategy) {
    return orderAlphabetically(denoms.filter(isDenomStable));
  }

  if (strategyType === StrategyType.DCAPlusOut) {
    return orderAlphabetically(denoms.filter(isSupportedDenomForDcaPlus));
  }

  if (strategyType === StrategyType.DCAOut) {
    return orderAlphabetically(denoms.filter(isDenomVolatile));
  }

  return orderAlphabetically(denoms);
}

function getResultingDenomsFromStrategyType(
  strategyType: StrategyType | undefined,
  pairs: HydratedPair[],
  initialDenom: DenomInfo,
) {
  if (!strategyType || !pairs || !initialDenom) return [];

  const resultingDenoms = getResultingDenoms(pairs, initialDenom);

  if (strategyType === StrategyType.DCAPlusIn) {
    return resultingDenoms.filter(isSupportedDenomForDcaPlus);
  }

  return resultingDenoms;
}

export function AssetsForm() {
  const { allDenoms } = useDenoms();
  const { hydratedPairs } = usePairs();
  const [initialDenom, meta, helpers] = useField({ name: 'initialDenom' });
  const [resultingField, resultingMeta, resultingHelpers] = useField({ name: 'resultingDenom' });
  const [strategyField] = useField({ name: 'strategyType' });
  const { chainId } = useChainId();
  const { getDenomInfo } = useDenoms();

  const initialDenomInfo = initialDenom.value;

  if (!hydratedPairs || !initialDenomInfo)
    return (
      <Box height={200}>
        <Center h="full">
          <Spinner />
        </Center>
      </Box>
    );

  const isDcaInStrategy = getIsDcaInStrategy(strategyField.value);

  return (
    <>
      <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
        <FormLabel>
          {isDcaInStrategy
            ? 'How will you fund your first investment?'
            : 'What position do you want to take profit on?'}
        </FormLabel>
        <FormHelperText>
          <Center>
            <Text textStyle="body-xs">
              {isDcaInStrategy
                ? 'Choose stablecoin'
                : `CALC currently supports pairs trading on ${getChainDexName(chainId)}.`}{' '}
            </Text>
            <Spacer />
            <AvailableFunds denom={initialDenomInfo} />
          </Center>
        </FormHelperText>
        <SimpleGrid columns={2} spacing={2}>
          <Box>
            <DenomSelect
              denoms={getInitialDenomsFromStrategyType(strategyField.value, allDenoms)}
              placeholder="Choose&nbsp;asset"
              value={initialDenom.value}
              onChange={(v) => v && helpers.setValue(getDenomInfo(v))}
              optionLabel={getChainDexName(chainId)}
            />
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          </Box>
          <InitialDeposit />
        </SimpleGrid>
      </FormControl>
      <FormControl isInvalid={Boolean(resultingMeta.touched && resultingMeta.error)} isDisabled={!initialDenom.value}>
        <FormLabel hidden={!isDcaInStrategy}>What asset do you want to invest in?</FormLabel>
        <FormLabel hidden={isDcaInStrategy}>How do you want to hold your profits?</FormLabel>
        <FormHelperText>
          <Text textStyle="body-xs">
            {isDcaInStrategy
              ? 'CALC will purchase this asset for you'
              : 'You will have the choice to move these funds into another strategy at the end.'}
          </Text>
        </FormHelperText>
        <DenomSelect
          denoms={getResultingDenomsFromStrategyType(strategyField.value, hydratedPairs, initialDenom.value)}
          placeholder="Choose asset"
          value={resultingField.value}
          onChange={(v) => v && resultingHelpers.setValue(getDenomInfo(v))}
          optionLabel={`Swapped on ${getChainDexName(chainId)}`}
        />
        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      </FormControl>
    </>
  );
}
