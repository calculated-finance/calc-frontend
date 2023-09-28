import { Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spacer, Text, Button } from '@chakra-ui/react';
import { useField } from 'formik';
import { useDenom } from '@hooks/useDenom/useDenom';
import { formatFiat } from '@helpers/format/formatFiat';
import { MINIMUM_SWAP_VALUE_IN_USD } from 'src/constants';
import totalExecutions from '@utils/totalExecutions';
import executionIntervalDisplay from '@helpers/executionIntervalDisplay';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DenomInput } from './DenomInput';

export default function SwapAmountLegacy({
  initialDenomString,
  resultingDenomString,
}: {
  initialDenomString: string | undefined;
  resultingDenomString: string | undefined;
}) {
  const [{ onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: initialDeposit }, depositMeta] = useField({ name: 'initialDeposit' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });

  const initialDenom = useDenom(initialDenomString);
  const resultingDenom = useDenom(resultingDenomString);

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = initialDeposit && field.value ? totalExecutions(initialDeposit, field.value) : 0;
  const displayExecutionInterval =
    executionInterval &&
    executions > 0 &&
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error && initialDeposit)}>
      <FormLabel>How much {initialDenom.name} each purchase?</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {resultingDenom.name}.</Text>
          <Spacer />
          <Flex flexDirection="row">
            <Text ml={4} mr={1}>
              Max:
            </Text>
            <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleClick}>
              {initialDeposit && !depositMeta.error && depositMeta.touched
                ? initialDeposit?.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 }) ?? '-'
                : '-'}
            </Button>
          </Flex>
        </Flex>{' '}
      </FormHelperText>
      <DenomInput denom={initialDenom} onChange={helpers.setValue} {...field} isDisabled={!initialDeposit} />
      {/* <FormHelperText>Swap amount must be greater than {formatFiat(MINIMUM_SWAP_VALUE_IN_USD)}</FormHelperText> */}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {initialDeposit && !depositMeta.error && depositMeta.touched && field.value > 0 && (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      )}
    </FormControl>
  );
}
