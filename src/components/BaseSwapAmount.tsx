import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import { DcaInFormDataStep1 } from '@models/DcaInFormData';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { getDenomName } from '@utils/getDenomInfo';
import { DenomInput } from './DenomInput';

export default function BaseSwapAmount({ step1State }: { step1State: DcaInFormDataStep1; isSell?: boolean }) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });

  const { initialDeposit } = step1State;

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = totalExecutions(step1State.initialDeposit, field.value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Set your base {getDenomName(step1State.initialDenom)} swap amount</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The base amount you want swapped each interval.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Max:
            </Text>
            <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleClick}>
              {initialDeposit.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 }) ?? '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <DenomInput denom={step1State.initialDenom} onChange={helpers.setValue} {...field} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {Boolean(field.value) && !meta.error && (
        <FormHelperText color="brand.200" fontSize="xs">
          With no price change, {executions} swaps over {executions} {displayExecutionInterval}.
        </FormHelperText>
      )}
    </FormControl>
  );
}
