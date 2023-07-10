import { Text, Button, Center, Tooltip } from '@chakra-ui/react';
import useBalance, { getDisplayAmount } from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { useField } from 'formik';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { DenomInfo } from '@utils/DenomInfo';
import { useWallet } from '@hooks/useWallet';
import { useWalletModal } from '@hooks/useWalletModal';

export function AvailableFunds({ denom }: { denom: DenomInfo }) {
  const { connected } = useWallet();
  const [, , helpers] = useField('initialDeposit');

  const { price } = useFiatPrice(denom);

  const { data, isLoading } = useBalance(denom);

  const createStrategyFee = price ? Number(createStrategyFeeInTokens(price)) : 0;
  const balance = Number(data?.amount);

  const displayAmount = getDisplayAmount(denom, Math.max(balance - createStrategyFee, 0));
  const displayFee = getDisplayAmount(denom, createStrategyFee);

  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

  const { setVisible } = useWalletModal();
  const handleConnect = () => {
    setVisible(true);
  };
  return (
    <Center textStyle="body-xs">
      <Tooltip
        isDisabled={balance === 0}
        label={`This is the estimated balance available to you after fees have been deducted ( ${String.fromCharCode(
          8275,
        )} ${displayFee} ${denom.name}). This excludes gas fees, so please make sure you have remaining funds.`}
      >
        <Text mr={1}>Max*: </Text>
      </Tooltip>
      {connected ? (
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
      ) : (
        <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleConnect}>
          Connect wallet
        </Button>
      )}
    </Center>
  );
}
