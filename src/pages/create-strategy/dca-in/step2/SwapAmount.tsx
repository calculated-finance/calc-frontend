import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  Image,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import totalExecutions from 'src/utils/totalExecutions';
import { DcaInFormDataStep1 } from '../../../../types/DcaInFormData';
import executionIntervalDisplay from "../confirm-purchase/executionIntervalDisplay";
import { ExecutionIntervals } from './ExecutionIntervals';

export default function SwapAmount({ step1State }: { step1State: DcaInFormDataStep1 }) {
  const [{ value, onChange, ...field }, meta, helpers] = useField({ name: 'swapAmount' });
  const [{ value: executionInterval }] = useField({ name: 'executionInterval' });

  const { icon: quoteDenomIcon, name: quoteDenomName } = getDenomInfo(step1State.quoteDenom);
  const { name: baseDenomName } = getDenomInfo(step1State.baseDenom);
  const { initialDeposit } = step1State;

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const numberValue = e.currentTarget.value;
    helpers.setValue(numberValue === '' ? null : numberValue);
  };

  const handleClick = () => {
    helpers.setValue(initialDeposit);
  };

  const executions = totalExecutions(step1State.initialDeposit, value);
  const displayExecutionInterval =
    executionIntervalDisplay[executionInterval as ExecutionIntervals][executions > 1 ? 1 : 0];

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>How much {quoteDenomName} each purchase?</FormLabel>
      <FormHelperText>
        <Flex alignItems="flex-start">
          <Text>The amount you want swapped each purchase for {baseDenomName}.</Text>
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
          <Image src={quoteDenomIcon} />
        </InputLeftElement>
        <Input
          type="number"
          onChange={handleChange}
          placeholder="Enter amount"
          value={value === null ? undefined : value}
          {...field}
        />
        <InputRightElement textAlign="right" mr={3} textStyle="body-xs">
          <Text>{quoteDenomName}</Text>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
      {value && !meta.error && (
        <FormHelperText color="brand.200" fontSize="xs">
          A total of {executions} swaps will take place over {executions} {displayExecutionInterval}.
        </FormHelperText>
      )}
    </FormControl>
  );
}
