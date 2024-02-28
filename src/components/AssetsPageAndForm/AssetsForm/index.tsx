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
import { values } from 'rambda';

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
    return denoms.filter(isDenomStable);
  }

  if (strategyType === StrategyType.DCAPlusOut) {
    return denoms.filter(isSupportedDenomForDcaPlus);
  }

  if (strategyType === StrategyType.DCAOut) {
    return denoms.filter(isDenomVolatile);
  }

  return denoms;
}

function getResultingDenomsFromStrategyType(
  strategyType: StrategyType | undefined,
  pairs: HydratedPair[],
  initialDenom: DenomInfo,
) {
  if (!strategyType || !pairs || !initialDenom) return [];

  const resultingDenoms = getResultingDenoms(pairs, initialDenom).filter((denom) => denom.id !== initialDenom.id);

  if (strategyType === StrategyType.DCAPlusIn) {
    return resultingDenoms.filter(isSupportedDenomForDcaPlus);
  }

  return resultingDenoms;
}

export function AssetsForm() {
  const { denoms } = useDenoms();
  const { pairs } = usePairs();
  const [initialDenom, meta, helpers] = useField({ name: 'initialDenom' });
  const [resultingDenom, resultingDenomMeta, resultingDenomHelpers] = useField({ name: 'resultingDenom' });
  const [strategyType] = useField({ name: 'strategyType' });
  const { chainId } = useChainId();
  const { getDenomById } = useDenoms();

  if (!pairs || !denoms?.[chainId])
    return (
      <Box height={200}>
        <Center h="full">
          <Spinner />
        </Center>
      </Box>
    );

  const isDcaInStrategy = getIsDcaInStrategy(strategyType.value);

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
            <AvailableFunds deconvertValue denom={initialDenom.value} />
          </Center>
        </FormHelperText>
        <SimpleGrid columns={2} spacing={2}>
          <Box>
            <DenomSelect
              denoms={
                denoms && chainId && denoms[chainId]
                  ? orderAlphabetically(getInitialDenomsFromStrategyType(strategyType.value, values(denoms[chainId])))
                  : []
              }
              placeholder="Choose&nbsp;asset"
              value={initialDenom.value.id}
              onChange={(v) => v && helpers.setValue(getDenomById(v))}
              optionLabel={getChainDexName(chainId)}
            />
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          </Box>
          <InitialDeposit />
        </SimpleGrid>
      </FormControl>
      <FormControl
        isInvalid={Boolean(resultingDenomMeta.touched && resultingDenomMeta.error)}
        isDisabled={!initialDenom.value}
      >
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
          denoms={getResultingDenomsFromStrategyType(strategyType.value, pairs, initialDenom.value)}
          placeholder="Choose asset"
          value={resultingDenom.value}
          onChange={(v) => v && resultingDenomHelpers.setValue(getDenomById(v))}
          optionLabel={`Swapped on ${getChainDexName(chainId)}`}
        />
        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      </FormControl>
    </>
  );
}
