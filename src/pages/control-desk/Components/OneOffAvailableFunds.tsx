import { Text, Button, Center, Tooltip, useDisclosure } from '@chakra-ui/react';
import useBalance from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { DenomInfo } from '@utils/DenomInfo';
import OnRampModal from '@components/OnRampModalContent';
import SquidModal from '@components/SquidModal';
import { useWallet } from '@hooks/useWallet';
import { useWalletModal } from '@hooks/useWalletModal';
import { Coin } from '@cosmjs/proto-signing';
import { GetFundsButton, GetFundsModal } from '@components/AvailableFunds';

function OneOffAvailableFundsButton({
  denom,
  isLoading,
  data,
  inputPrice,
}: {
  inputPrice: number | undefined,
  denom: DenomInfo;
  isLoading: boolean;
  data: Coin | undefined;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOnRampOpen, onClose: onOnRampClose, onOpen: onOnRampOpen } = useDisclosure();
  const { isOpen: isSquidOpen, onClose: onSquidClose, onOpen: onSquidOpen } = useDisclosure();

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const createStrategyFee = inputPrice ? Number(createStrategyFeeInTokens(inputPrice)) : 0;
  const balance = Number(data?.amount);
  const displayAmount = (denom.conversion(Math.max(balance - createStrategyFee, 0)))

  const maxDisplayAmount = displayAmount && (displayAmount).toFixed(2)


  const handleConnect = () => {
    setVisible(true);
  };

  function handleOpen(onOpener: () => void) {
    return () => {
      onClose();
      onOpener();
    };
  }

  if (maxDisplayAmount) {
    return (
      <Button
        size="xs"
        isLoading={isLoading}
        textColor='whiteAlpha.900'
        variant='unstyled'
        cursor='default'
      >
        {maxDisplayAmount}
      </Button>

    );
  }

  if (connected) {
    return (
      <>
        <GetFundsButton onOpen={onOpen} />
        <GetFundsModal
          isOpen={isOpen}
          onClose={onClose}
          onSquidOpen={handleOpen(onSquidOpen)}
          onOnRampOpen={handleOpen(onOnRampOpen)}
        />
        <SquidModal isOpen={isSquidOpen} onClose={onSquidClose} />
        <OnRampModal isOpen={isOnRampOpen} onClose={onOnRampClose} />
      </>
    );
  }

  return (
    <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleConnect}>
      Connect wallet
    </Button>
  );
}

export function OneOffAvailableFunds({ inputPrice, denom }: { denom: DenomInfo; inputPrice: number | undefined }) {
  const { price } = useFiatPrice(denom);
  const { data, isLoading } = useBalance(denom);
  const createStrategyFee = price ? Number(createStrategyFeeInTokens(price)) : 0;
  const balance = Number(data?.amount);

  const displayFee = denom.conversion(createStrategyFee);

  return (
    <Center textStyle="body-xs">
      <Tooltip
        isDisabled={balance === 0}
        label={`This is the estimated balance available to you after fees have been deducted ( ${String.fromCharCode(
          8275,
        )} ${displayFee} ${denom.name}). This excludes gas fees, so please make sure you have remaining funds.`}
      >
        <Text whiteSpace='nowrap' mr={1}>Balance*: </Text>
      </Tooltip>
      <OneOffAvailableFundsButton isLoading={isLoading} data={data} denom={denom} inputPrice={inputPrice} />

    </Center>
  );
}
