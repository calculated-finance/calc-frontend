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
import { getIsInStrategy } from '@helpers/assets-page/getIsInStrategy';
import { Pair } from 'src/interfaces/v2/generated/query';
import { StrategyTypes } from '@models/StrategyTypes';
import { DenomInfo } from '@utils/DenomInfo';

function getInitialDenomsFromStrategyType(strategyType: StrategyTypes | undefined, pairs: Pair[]): DenomInfo[] {
  if (!strategyType || !pairs) {
    return [];
  }

  const isInStrategy = getIsInStrategy(strategyType);

  if (isInStrategy) {
    return orderAlphabetically(
      Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
        .map((denom) => getDenomInfo(denom))
        .filter(isDenomStable),
    );
  }

  if (strategyType === StrategyTypes.DCAPlusOut) {
    return orderAlphabetically(
      Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
        .map((denom) => getDenomInfo(denom))
        .filter(isSupportedDenomForDcaPlus),
    );
  }

  if (strategyType === StrategyTypes.DCAOut) {
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
  strategyType: StrategyTypes | undefined,
  pairs: Pair[],
  initialDenom: string,
) {
  if (!strategyType || !pairs || !initialDenom) {
    return [];
  }

  const resultingDenoms = getResultingDenoms(pairs, getDenomInfo(initialDenom));

  if (strategyType === StrategyTypes.DCAPlusIn) {
    return resultingDenoms.filter(isSupportedDenomForDcaPlus);
  }

  return resultingDenoms;
}

export function AssetsForm() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta, helpers] = useField({ name: 'initialDenom' });
  const [resultingField, resultingMeta, resultingHelpers] = useField({ name: 'resultingDenom' });
  const [strategyField] = useField({ name: 'strategyType' });
  const { chainId } = useChainId();

  if (!pairs) {
    return null;
  }

  const isInStrategy = getIsInStrategy(strategyField.value);

  return (
    <>
      <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
        <FormLabel>
          {isInStrategy ? 'How will you fund your first investment?' : 'What position do you want to take profit on?'}
        </FormLabel>
        <FormHelperText>
          <Center>
            <Text textStyle="body-xs">
              {isInStrategy
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
        <FormLabel hidden={!isInStrategy}>What asset do you want to invest in?</FormLabel>
        <FormLabel hidden={isInStrategy}>How do you want to hold your profits?</FormLabel>
        <FormHelperText>
          <Text textStyle="body-xs">
            {isInStrategy
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
