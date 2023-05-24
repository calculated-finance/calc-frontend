import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import { DcaInFormDataStep1 } from '@models/DcaInFormData';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DenomInput } from './DenomInput';

export default function SwapAmount({
  step1State,
  isSell = false,
}: {
  step1State: DcaInFormDataStep1;
  isSell?: boolean;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });
  const [{ value: executionIntervalIncrement }] = useField({ name: 'executionIntervalIncrement' });

  const { name: initialDenomName } = getDenomInfo(step1State.initialDenom);
  const { name: resultingDenomName } = getDenomInfo(step1State.resultingDenom);
  const { initialDeposit } = step1State;

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = totalExecutions(step1State.initialDeposit, field.value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];
  const displayCustomExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][
      executions * executionIntervalIncrement > 1 ? 1 : 0
    ];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>
        How much {initialDenomName} each {isSell ? 'swap' : 'purchase'}?
      </FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenomName}.</Text>
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
      {Boolean(field.value) && !meta.error && !executionIntervalIncrement ? (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      ) : (
        Boolean(field.value) &&
        !meta.error && (
          <FormHelperText color="brand.200" fontSize="xs">
            A total of {executions} swaps will take place over {executions * executionIntervalIncrement}{' '}
            {displayCustomExecutionInterval}.
          </FormHelperText>
        )
      )}
    </FormControl>
  );
}
