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
import { useField } from 'formik';
import { AvailableFunds } from '@components/AvailableFunds';
import InitialDeposit from '@components/InitialDeposit';
import { getChainDexName } from '@helpers/chains';
import { useChainId } from '@hooks/useChain';
import { DenomInfo } from '@utils/DenomInfo';
import getDenomInfo from '@utils/getDenomInfo';
import { DenomSelect } from '../DenomSelect';

// its rough to name this quote denom, change to something more generic like "starting denom"
export default function DCAOutInitialDenom({ denoms }: { denoms: DenomInfo[] }) {
  const [field, meta, helpers] = useField({ name: 'initialDenom' });

  const { chainId: chain } = useChainId();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>What position do you want to take profit on? </FormLabel>
      <FormHelperText>
        <Center>
          <Text textStyle="body-xs">CALC currently supports pairs trading on {getChainDexName(chain)}.</Text>
          <Spacer />
          {field.value && <AvailableFunds denom={getDenomInfo(field.value)} />}
        </Center>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <DenomSelect
            denoms={denoms}
            placeholder="Choose&nbsp;asset"
            value={field.value}
            onChange={helpers.setValue}
            optionLabel={getChainDexName(chain)}
          />
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}
