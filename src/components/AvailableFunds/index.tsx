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
import { Coin } from '@cosmjs/proto-signing';
import { useChainContext } from '@hooks/useChainContext';

interface GetFundsDetailsProps {
  onSquidOpen: () => void;
  onOnRampOpen: () => void;
}

interface GetFundsButtonProps {
  onOpen: () => void;
}

export function GetFundsDetails({ onSquidOpen, onOnRampOpen }: GetFundsDetailsProps) {
  return (
    <Stack
      direction={{ base: 'column', sm: 'row' }}
      spacing={4}
      px={8}
      py={4}
      bg="abyss.200"
      fontSize="sm"
      borderRadius="xl"
      borderWidth={1}
      borderColor="slateGrey"
      w="full"
    >
      <Grid templateColumns="repeat(1, 1fr)" textAlign="center" px={2} w={{ base: 'full', sm: 56 }} gap={4}>
        <GridItem h={6}>
          <Center>
            <Image src="/images/squid-icon-logo-yellow.svg" alt="squid-logo" h={6} />
          </Center>
        </GridItem>

        <GridItem h={{ base: 8, sm: 12 }}>
          <Heading size="xs">Squid Cross Chain Bridge</Heading>
          <FormHelperText>Good for getting assets from other chains here.</FormHelperText>
        </GridItem>
        <GridItem>
          <Button w={40} onClick={onSquidOpen}>
            Move assets here
          </Button>
        </GridItem>
      </Grid>

      <Grid
        templateColumns="repeat(1, 1fr)"
        textAlign="center"
        px={2}
        w={{ base: 'full', sm: 56 }}
        gap={4}
        pt={{ base: 4, sm: 'initial' }}
      >
        <GridItem h={6}>
          <Center>
            <Image src="/images/kado-no-padding.png" alt="kado-logo" h={6} />
          </Center>
        </GridItem>

        <GridItem h={{ base: 8, sm: 12 }}>
          <Heading size="xs">Buy Crypto</Heading>
          <FormHelperText>Good for getting crypto with cash.</FormHelperText>
        </GridItem>
        <GridItem>
          <Button w={40} onClick={onOnRampOpen}>
            Buy crypto
          </Button>
        </GridItem>
      </Grid>
    </Stack>
  );
}

export function GetFundsModal({
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

export function GetFundsButton({ onOpen }: GetFundsButtonProps) {
  return (
    <HStack spacing={1}>
      <Text fontSize="xs">None</Text>
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

  const chainContext = useChainContext();
  const [, , helpers] = useField('initialDeposit');
  const { price } = useFiatPrice(denom);

  const createStrategyFee = price ? Number(createStrategyFeeInTokens(price)) : 0;
  const balance = Number(data?.amount);
  const displayAmount = denom.conversion(Math.max(balance - createStrategyFee, 0));

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

  if (chainContext?.isWalletConnected) {
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
    <Button size="xs" colorScheme="blue" variant="link" cursor="pointer" onClick={chainContext?.openView}>
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
