import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Spacer,
  Text,
  Button,
  Input,
} from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import { DcaInFormDataStep1 } from '../../../../models/DcaInFormData';
import executionIntervalDisplay from '../../../../helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '../../../../models/ExecutionIntervals';
import { DenomInput } from '../../../../components/DenomInput';

export default function PortfolioName() {
  const [field, meta, helpers] = useField({ name: 'portfolioName' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Name this basket of assets</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>This name will be shown in your list of strategies.</Text>
        </Flex>{' '}
      </FormHelperText>
      <Input placeholder="Enter name" {...field} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
