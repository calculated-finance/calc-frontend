import { Text, Button, Center, Tooltip, useDisclosure } from '@chakra-ui/react';
import useBalance from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { useField } from 'formik';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { DenomInfo } from '@utils/DenomInfo';
import OnRampModal from '@components/OnRampModalContent';
import SquidModal from '@components/SquidModal';
import { useWallet } from '@hooks/useWallet';
import { useWalletModal } from '@hooks/useWalletModal';
import { Coin } from '@cosmjs/proto-signing';
import { GetFundsButton, GetFundsModal } from '@components/AvailableFunds';
import getDenomInfo from '@utils/getDenomInfo';

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


  const [field, ,] = useField({ name: 'resultingDenom' })
  const outputAsset = getDenomInfo(field.value)
  const { price: resultingPrice } = useFiatPrice(outputAsset);

  const { connected } = useWallet();
  const [, , helpers] = useField('targetAmount');
  const [, , { setValue }] = useField({ name: 'collateralisedMultiplier' });
  const { setVisible } = useWalletModal();

  const createStrategyFee = inputPrice ? Number(createStrategyFeeInTokens(inputPrice)) : 0;
  const balance = Number(data?.amount);
  const displayAmount = resultingPrice && (denom.conversion(Math.max(balance - createStrategyFee, 0)) / resultingPrice)

  const maxDisplayAmount = displayAmount && (displayAmount).toFixed(2)


  const handleConnect = () => {
    setVisible(true);
  };
  const handleClick = () => {
    helpers.setValue(maxDisplayAmount);
    setValue(1)
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
        colorScheme="blue"
        variant="link"
        cursor="pointer"
        isDisabled={!maxDisplayAmount}
        onClick={handleClick}
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
  const { data, isLoading } = useBalance(denom);
  const createStrategyFee = inputPrice ? Number(createStrategyFeeInTokens(inputPrice)) : 0;
  const balance = Number(data?.amount);
  const displayFee = denom.conversion(createStrategyFee);

  return (
    <Center textStyle="body-xs">
      <Tooltip
        isDisabled={balance === 0}
        label={`This is the estimated balance available to you after fees have been deducted ( ${String.fromCharCode(
          8275,
        )} ${displayFee} ${denom.name}). This excludes gas fees, so please make sure you have remaining funds.\nWe have also calculated your absolute maximum target amount by ((Input asset balance/Current price of output asset)*1.20).`}
      >
        <Text whiteSpace='nowrap' mr={1}>Max target*: </Text>
      </Tooltip>
      <OneOffAvailableFundsButton isLoading={isLoading} data={data} denom={denom} inputPrice={inputPrice} />
    </Center>
  );
}
