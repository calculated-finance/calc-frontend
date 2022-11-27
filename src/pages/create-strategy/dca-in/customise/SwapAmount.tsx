import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  InputRightElement,
  Button,
  Input,
} from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import NumberInput from '@components/NumberInput';
import DenomIcon from '@components/DenomIcon';
import { DcaInFormDataStep1 } from '../../../../models/DcaInFormData';
import executionIntervalDisplay from '../../../../helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '../../../../models/ExecutionIntervals';

export default function SwapAmount({ step1State }: { step1State: DcaInFormDataStep1 }) {
  const [field, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });

  const { name: initialDenomName } = getDenomInfo(step1State.initialDenom);
  const { name: resultingDenomName } = getDenomInfo(step1State.resultingDenom);
  const { initialDeposit } = step1State;

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = totalExecutions(step1State.initialDeposit, field.value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much {initialDenomName} each purchase?</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenomName}.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text mr={1}>Max: </Text>
            <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleClick}>
              {initialDeposit.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 }) ?? '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <InputGroup>
        <InputLeftElement>
          <DenomIcon denomName={step1State.initialDenom} />
        </InputLeftElement>
        <Input type="number" placeholder="Enter amount" {...field} />
        <InputRightElement flexGrow={1} textAlign="right" textStyle="body-xs">
          {initialDenomName}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {Boolean(field.value) && !meta.error && (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      )}
    </FormControl>
  );
}
