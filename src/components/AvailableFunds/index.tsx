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
import useBalance from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { useField } from 'formik';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { DenomInfo } from '@utils/DenomInfo';
import OnRampModal from '@components/OnRampModalContent';
import SquidModal from '@components/SquidModal';
import { featureFlags } from 'src/constants';
import { useWallet } from '@hooks/useWallet';
import { useWalletModal } from '@hooks/useWalletModal';
import { Coin } from '@cosmjs/proto-signing';

interface GetFundsDetailsProps {
  onSquidOpen: () => void;
  onOnRampOpen: () => void;
}

interface GetFundsButtonProps {
  onOpen: () => void;
}

function GetFundsDetails({ onSquidOpen, onOnRampOpen }: GetFundsDetailsProps) {
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
        </GridItem>
        <GridItem>
          <Button w={40} onClick={onOnRampOpen}>
            Buy crypto
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
}

function GetFundsModal({
  onSquidOpen,
  onOnRampOpen,
  isOpen,
  onClose,
}: Omit<ModalProps, 'children'> & GetFundsDetailsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Get Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack justify="center" gap={6} align="center">
            <GetFundsDetails onSquidOpen={onSquidOpen} onOnRampOpen={onOnRampOpen} />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function GetFundsButton({ onOpen }: GetFundsButtonProps) {
  return (
    <HStack spacing={1}>
      <Text fontSize="xs">None</Text>
      {featureFlags.getFundsModalEnabled && (
        <Button
          size="xs"
          data-testid="get-funds-button"
          colorScheme="blue"
          variant="link"
          cursor="pointer"
          onClick={onOpen}
        >
          Get funds
        </Button>
      )}
    </HStack>
  );
}

function AvailableFundsButton({
  denom,
  isLoading,
  data,
}: {
  denom: DenomInfo;
  isLoading: boolean;
  data: Coin | undefined;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOnRampOpen, onClose: onOnRampClose, onOpen: onOnRampOpen } = useDisclosure();
  const { isOpen: isSquidOpen, onClose: onSquidClose, onOpen: onSquidOpen } = useDisclosure();

  const { connected } = useWallet();
  const [, , helpers] = useField('initialDeposit');
  const { setVisible } = useWalletModal();
  const { price } = useFiatPrice(denom);

  const createStrategyFee = price ? Number(createStrategyFeeInTokens(price)) : 0;
  const balance = Number(data?.amount);
  const displayAmount = denom.conversion(Math.max(balance - createStrategyFee, 0));

  const handleConnect = () => {
    setVisible(true);
  };
  const handleClick = () => {
    helpers.setValue(displayAmount);
  };

  function handleOpen(onOpener: () => void) {
    return () => {
      onClose();
      onOpener();
    };
  }

  if (displayAmount) {
    return (
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

export function AvailableFunds({ denom }: { denom: DenomInfo }) {
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
        <Text mr={1}>Max*: </Text>
      </Tooltip>
      <AvailableFundsButton isLoading={isLoading} data={data} denom={denom} />
    </Center>
  );
}
