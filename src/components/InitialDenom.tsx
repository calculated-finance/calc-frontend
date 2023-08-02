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
  import usePairs, { orderAlphabetically, uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
  import getDenomInfo, { isDenomStable } from '@utils/getDenomInfo';
  import { useField } from 'formik';
  import { AvailableFunds } from '@components/AvailableFunds';
  import { DenomSelect } from '@components/DenomSelect';
  import InitialDeposit from '@components/InitialDeposit';
import { useChain } from '@hooks/useChain';
import { DenomInfo } from '@utils/DenomInfo';
import { getChainDexName } from '@helpers/chains';
  
  export function InitialDenom({ denomsOut }: { denomsOut: DenomInfo[] | undefined }) {
    const { data } = usePairs();
    const { pairs } = data || {};
    const [field, meta, helpers] = useField({ name: 'initialDenom' });
    const { chain } = useChain();

    if (!pairs) {
      return null;
    }
  
    const denomsIn = orderAlphabetically(
      Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
        .map((denom) => getDenomInfo(denom))
        .filter(isDenomStable),
    );
  
    return (
      <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
        <FormLabel>{!denomsOut ? 'How will you fund your first investment?' : 'What position do you want to take profit on?'}</FormLabel>
        <FormHelperText>
          <Center>
            <Text textStyle="body-xs">{!denomsOut ? 'Choose stablecoin' : `CALC currently supports pairs trading on ${getChainDexName(chain)}.`} </Text>
            <Spacer />
            {field.value && <AvailableFunds denom={getDenomInfo(field.value)} />}
          </Center>
        </FormHelperText>

        <SimpleGrid columns={2} spacing={2}>
          <Box>
            <DenomSelect
              denoms={!denomsOut ? denomsIn : denomsOut}
              placeholder="Choose&nbsp;asset"
              value={field.value}
              onChange={helpers.setValue}
              showPromotion
              optionLabel={getChainDexName(chain)}

            />
            <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
          </Box>
          <InitialDeposit />
        </SimpleGrid>
      </FormControl>
    )
   
  }