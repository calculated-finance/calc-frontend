import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import { useChain } from '@hooks/useChain';
import { getChainDexName } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { DenomSelect } from './DenomSelect';
import { TransactionType } from './TransactionType';

export default function DCAInResultingDenom({ denoms }: { denoms: DenomInfo[] }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });
  const { chain } = useChain();

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>What asset do you want to invest in?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
      </FormHelperText>
      <DenomSelect
        denoms={denoms}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        optionLabel={`Swapped on ${getChainDexName(chain)}`}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );



  // DCA OUT 

  (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel>How do you want to hold your profits?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">You will have the choice to move these funds into another strategy at the end.</Text>
      </FormHelperText>
      <DenomSelect
        denoms={denoms}
        placeholder="Choose asset"
        value={field.value}
        onChange={helpers.setValue}
        showPromotion
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
 );
}
