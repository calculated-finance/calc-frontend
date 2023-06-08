import { Text, Button, Center, Tooltip } from '@chakra-ui/react';
import useBalance, { getDisplayAmount } from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import getDenomInfo from '@utils/getDenomInfo';
import { useField } from 'formik';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';

export function AvailableFunds() {
  const [field] = useField({ name: 'initialDenom' });
  const [, , helpers] = useField('initialDeposit');

  const { price } = useFiatPrice(field.value);

  const createStrategyFee = Number(createStrategyFeeInTokens(price));

  const { data, isLoading } = useBalance(field.value ? getDenomInfo(field.value) : undefined);

  if (!field.value) {
    return null;
  }

  const initialDenom = getDenomInfo(field.value);

  const balance = Number(data?.amount);

  const displayAmount = getDisplayAmount(initialDenom, Math.max(balance - createStrategyFee, 0));
  const displayFee = getDisplayAmount(initialDenom, createStrategyFee);

  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

  return (
    <Center textStyle="body-xs">
      <Tooltip
        isDisabled={balance === 0}
        label={`This is the estimated balance available to you after fees have been deducted ( ${String.fromCharCode(
          8275,
        )} ${displayFee} ${initialDenom.name}). This excludes gas fees, so please make sure you have remaining funds.`}
      >
        <Text mr={1}>Max*: </Text>
      </Tooltip>

      <Button
        size="xs"
        isLoading={isLoading}
        colorScheme="blue"
        variant="link"
        cursor="pointer"
        isDisabled={!displayAmount}
        onClick={handleClick}
      >
        {displayAmount || 'None'}
      </Button>
    </Center>
  );
}
