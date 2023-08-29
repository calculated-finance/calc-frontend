import { FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, SimpleGrid, Spacer, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import { useChain } from '@hooks/useChain';
import { getChainDexName } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { DenomSelect } from '@components/DenomSelect';
import TargetAmount from './TargetAmount';

export default function OutputAsset({ denoms }: { denoms: DenomInfo[] }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });
  const { chain } = useChain();

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>Select output asset and amount.</FormLabel>
      <HStack>
        <FormHelperText>
          <Text textStyle="body-xs">Asset to make payment in:</Text>
        </FormHelperText>
        <Spacer />
        <FormHelperText>
          <Text textStyle="body-xs">Target amount:</Text>
        </FormHelperText>
      </HStack>
      <SimpleGrid columns={2} spacing={2}>
        <DenomSelect
          denoms={denoms}
          placeholder="Choose asset"
          value={field.value}
          onChange={helpers.setValue}
          optionLabel={`Swapped on ${getChainDexName(chain)}`}
        />
        <TargetAmount />
      </SimpleGrid>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
