import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import { useField, useFormikContext } from 'formik';
import { useChain } from '@hooks/useChain';
import { getIsInStrategy } from '@helpers/assets-page/getIsInStrategy';
import { getChainDexName } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { DenomSelect } from './DenomSelect';

export function ResultingDenom({ denoms, strategyType }: { denoms: DenomInfo[]; strategyType: string }) {
  const [field, meta, helpers] = useField({ name: 'resultingDenom' });
  const { chain } = useChain();

  const {
    values: { initialDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const isInStrategy = getIsInStrategy(strategyType)

  return (

    <FormControl isInvalid={Boolean(meta.touched && meta.error)} isDisabled={!initialDenom}>
      <FormLabel hidden={!isInStrategy}>What asset do you want to invest in?</FormLabel>
      <FormLabel hidden={isInStrategy}>How do you want to hold your profits?</FormLabel>

      <FormHelperText>
        <Text textStyle="body-xs">{isInStrategy ? 'CALC will purchase this asset for you' : 'You will have the choice to move these funds into another strategy at the end.'}</Text>
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
}
