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
import usePairs, {
  getResultingDenoms,
  isSupportedDenomForDcaPlus,
  orderAlphabetically,
  uniqueBaseDenoms,
  uniqueQuoteDenoms,
} from '@hooks/usePairs';
import getDenomInfo, { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useField } from 'formik';
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '@components/InitialDeposit';
import { useChainId } from '@hooks/useChainId';
import { getChainDexName } from '@helpers/chains';
import { Pair } from 'src/interfaces/v2/generated/query';
import { StrategyType } from '@models/StrategyType';
import { DenomInfo } from '@utils/DenomInfo';

function getIsDcaInStrategy(strategyType: string | undefined) {
  const strategy = strategyType && strategyType;
  return [StrategyType.DCAIn, StrategyType.DCAPlusIn, StrategyType.WeightedScaleIn].includes(strategy as StrategyType);
}

function getInitialDenomsFromStrategyType(strategyType: StrategyType | undefined, pairs: Pair[]): DenomInfo[] {
  if (!strategyType || !pairs) {
    return [];
  }

  const isDcaInStrategy = getIsDcaInStrategy(strategyType);

  if (isDcaInStrategy) {
    return orderAlphabetically(
      Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
        .map((denom) => getDenomInfo(denom))
        .filter(isDenomStable),
    );
  }

  if (strategyType === StrategyType.DCAPlusOut) {
    return orderAlphabetically(
      Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
        .map((denom) => getDenomInfo(denom))
        .filter(isSupportedDenomForDcaPlus),
    );
  }

  if (strategyType === StrategyType.DCAOut) {
    return orderAlphabetically(
      Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
        .map((denom) => getDenomInfo(denom))
        .filter(isDenomVolatile),
    );
  }

  return orderAlphabetically(
    Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) => getDenomInfo(denom)),
  );
}

function getResultingDenomsFromStrategyType(
  strategyType: StrategyType | undefined,
  pairs: Pair[],
  initialDenom: string,
) {
  if (!strategyType || !pairs || !initialDenom) {
    return [];
  }

  const resultingDenoms = getResultingDenoms(pairs, getDenomInfo(initialDenom));

  if (strategyType === StrategyType.DCAPlusIn) {
    return resultingDenoms.filter(isSupportedDenomForDcaPlus);
  }

  return resultingDenoms;
}

export function AssetsForm() {
  const { pairs } = usePairs();
  const [field, meta, helpers] = useField({ name: 'initialDenom' });
  const [resultingField, resultingMeta, resultingHelpers] = useField({ name: 'resultingDenom' });
  const [strategyField] = useField({ name: 'strategyType' });
  const { chainId } = useChainId();

  if (!pairs) {
    return null;
  }

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
            {field.value && <AvailableFunds denom={getDenomInfo(field.value)} />}
          </Center>
        </FormHelperText>
        <SimpleGrid columns={2} spacing={2}>
          <Box>
            <DenomSelect
              denoms={getInitialDenomsFromStrategyType(strategyField.value, pairs as Pair[])}
              placeholder="Choose&nbsp;asset"
              value={field.value}
              onChange={helpers.setValue}
              showPromotion
              optionLabel={getChainDexName(chainId)}
            />
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          </Box>
          <InitialDeposit />
        </SimpleGrid>
      </FormControl>
      <FormControl isInvalid={Boolean(resultingMeta.touched && resultingMeta.error)} isDisabled={!field.value}>
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
          denoms={getResultingDenomsFromStrategyType(strategyField.value, pairs as Pair[], field.value)}
          placeholder="Choose asset"
          value={resultingField.value}
          onChange={resultingHelpers.setValue}
          optionLabel={`Swapped on ${getChainDexName(chainId)}`}
        />
        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
      </FormControl>
    </>
  );
}
