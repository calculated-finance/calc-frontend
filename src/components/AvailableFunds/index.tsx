import {
  Text,
  Button,
  Center,
  Tooltip,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  ModalProps,
  Box,
  Grid,
  GridItem,
  Heading,
  FormHelperText,
  Image,
} from '@chakra-ui/react';
import useBalance, { getDisplayAmount } from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { useField } from 'formik';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { DenomInfo } from '@utils/DenomInfo';
import { useWallet } from '@hooks/useWallet';
import { useWalletModal } from '@hooks/useWalletModal';
import OnRampModal from '@components/OnRampModalContent';
import SquidModal from '@components/SquidModal';

function GetFundsDetails() {
  const { isOpen: isOnRampOpen, onClose: onOnRampClose, onOpen: onOnRampOpen } = useDisclosure();
  const { isOpen: isSquidOpen, onClose: onSquidClose, onOpen: onSquidOpen } = useDisclosure();

  return (
    <Box px={8} py={4} bg="abyss.200" fontSize="sm" borderRadius="xl" borderWidth={1} borderColor="slateGrey" w="full">
      <Grid templateColumns="repeat(2, 1fr)" gap={2} alignItems="center" justifyItems="center" textAlign="center">
        <GridItem>
          <Center pb={4}>
            <Image src="/images/squid-icon-logo-yellow.svg" alt="squid-logo" w={8} />
          </Center>
        </GridItem>
        <GridItem>
          <Center pb={4}>
            <Image src="/images/kado.svg" alt="kado-logo" w={20} />
          </Center>
        </GridItem>

        <GridItem>
          <Heading size="xs">Squid Cross Chain Bridge</Heading>
          <FormHelperText>Good for getting assets from other chains here.</FormHelperText>
        </GridItem>
        <GridItem mb={4}>
          <Heading size="xs">Buy Crypto</Heading>
          <FormHelperText>Good for getting crypto with cash.</FormHelperText>
        </GridItem>
        <GridItem>
          <Button w={40} onClick={onSquidOpen}>
            Move assets here
          </Button>
          <SquidModal isOpen={isSquidOpen} onClose={onSquidClose} />
        </GridItem>
        <GridItem>
          <Button w={40} onClick={onOnRampOpen}>
            Buy crypto
          </Button>
          <OnRampModal isOpen={isOnRampOpen} onClose={onOnRampClose} />
        </GridItem>
      </Grid>
    </Box>
  );
}

function GetFundsModal({ isOpen, onClose }: Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Get Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack justify="center" gap={6} align="center">
            <GetFundsDetails />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function GetFundsButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack spacing={1}>
      <Text fontSize="xs">None</Text>
      <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={onOpen}>
        Get funds
      </Button>
      <GetFundsModal isOpen={isOpen} onClose={onClose} />
    </HStack>
  );
}

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
      {connected && displayAmount ? (
        <Button
          size="xs"
          isLoading={isLoading}
          colorScheme="blue"
          variant="link"
          cursor="pointer"
          isDisabled={!displayAmount}
          onClick={handleClick}
        >
          {displayAmount}
        </Button>
      ) : connected && !displayAmount ? (
        <GetFundsButton />
      ) : (
        <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={handleConnect}>
          Connect wallet
        </Button>
      )}
    </Center>
  );
}
