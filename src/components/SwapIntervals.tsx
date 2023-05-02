import { Flex, FormControl, FormErrorMessage, FormHelperText, HStack, Spacer, Text } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from '@models/DcaInFormData';
import { TimePeriodInput } from './TimePeriodInput';
import { IncrementInput } from './IncrementInput';

export default function SwapIntervals({
  step1State,
  isSell = false,
}: {
  step1State: DcaInFormDataStep1;
  isSell?: boolean;
}) {
  // const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapInterval' });
  // const [{ value: customInterval }] = useField({ name: 'customInterval' });

  // const { name: initialDenomName } = getDenomInfo(step1State.initialDenom);
  // const { name: resultingDenomName } = getDenomInfo(step1State.resultingDenom);
  // const { initialDeposit } = step1State;

  // const handleClick = () => {
  //   helpers.setValue(initialDeposit);
  // };

  // const executions = totalExecutions(step1State.initialDeposit, field.value);
  // // const displayExecutionInterval =
  // //   executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  return (
    <FormControl>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>Time period</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Increment
            </Text>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <HStack spacing={1}>
        <TimePeriodInput />
        <Spacer />
        <IncrementInput />
      </HStack>
      <FormErrorMessage>error</FormErrorMessage>

      {/* {Boolean(field.value) && !meta.error && ( */}
      <FormHelperText color="brand.200" fontSize="xs">
        A total of xxxx swaps will take place over xxxx.
        {/* A total of {executions} swaps will take place over {executions} {displayExecutionInterval}. */}
      </FormHelperText>
      {/* )} */}
    </FormControl>
  );
}
