import {
  Button,
  Heading,
  Text,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useToast,
  ModalProps,
  Stack,
  Image,
  HStack,
  Box,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { getStrategyInitialDenom, getStrategyResultingDenom, isDcaPlus } from '@helpers/strategy';
import { getStandardDcaEndDate, getEscrowAmount } from '@helpers/strategy/dcaPlus';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@hooks/useStrategies';
import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import useCancelStrategy from 'src/hooks/useCancelStrategy';
import { CANCEL_VAULT_FEE } from 'src/constants';
import { formatDate } from '@helpers/format/formatDate';
import useStrategyEvents from '@hooks/useStrategyEvents';

type CancelStrategyModalProps = {
  strategy: Strategy;
  onCancel: () => void;
} & Omit<ModalProps, 'children'>;

export default function CancelStrategyModal({ isOpen, onClose, onCancel, strategy }: CancelStrategyModalProps) {
  const { mutate: cancelStrategy, isLoading } = useCancelStrategy(strategy.balance.denom);

  const { price } = { price: 1 }; // useFiatPrice(getStrategyInitialDenom(strategy));

  const toast = useToast();

  const { data: eventsData, isLoading: isEventsLoading } = useStrategyEvents(strategy.id, isOpen);

  const handleCancelStrategy = () =>
    cancelStrategy(strategy.id, {
      onSuccess: () => {
        toast({
          title: 'Strategy cancelled.',
          position: 'top-right',
          description: "We've cancelled your strategy and refunded remaining funds.",
          status: 'success',
          duration: 12000,
          variant: 'subtle',
          isClosable: true,
        });
        onCancel();
      },
      onError: (error: Error) => {
        toast({
          title: 'Something went wrong',
          position: 'top-right',
          description: `There was a problem cancelling your strategy (Reason: ${error.message})`,
          status: 'error',
          duration: 12000,
          isClosable: true,
          variant: 'subtle',
        });
      },
      onSettled: onClose,
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent data-testid="cancel-strategy-modal">
        <ModalHeader textAlign="center">Cancel Strategy?</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Text textStyle="body-xs" textAlign="center">
              By cancelling this strategy the unswapped balance in the vault will be returned. Once cancelled, this
              strategy can not be started again.
            </Text>
            <Stack layerStyle="panel" p={4} mt={4}>
              <Flex align="center">
                <Heading size="sm">Amount to be returned:</Heading>
                <Spacer />
                <Text as="span" fontSize="lg" color="blue.200">
                  {getDenomInfo(strategy.balance.denom).conversion(Number(strategy.balance.amount))}{' '}
                  {getDenomInfo(strategy.balance.denom).name}
                </Text>
              </Flex>
              {isDcaPlus(strategy) && (
                <Flex align="center">
                  <Heading size="sm">Amount escrowed:</Heading>
                  <Spacer />
                  <Text as="span" fontSize="lg" color="blue.200">
                    {getEscrowAmount(strategy)} {getDenomName(getStrategyResultingDenom(strategy))}
                  </Text>
                </Flex>
              )}
            </Stack>
            <Text textAlign="center" textStyle="body-xs" data-testid="cancel-strategy-model-fee">
              Cancellation Fee: {price ? parseFloat((CANCEL_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
              {getDenomName(getStrategyInitialDenom(strategy))}
            </Text>
            {isDcaPlus(strategy) && (
              <Box fontSize="xs" bg="abyss.200" p={4} borderRadius="md">
                {isEventsLoading ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : (
                  <HStack spacing={3} color="brand.200">
                    <Image src="/images/lightBulbOutline.svg" alt="light bulb" />
                    <Text>
                      Your escrow (minus performance fee) is estimated to be returned on{' '}
                      {formatDate(getStandardDcaEndDate(strategy, eventsData?.events))}
                    </Text>
                  </HStack>
                )}
              </Box>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" w="full">
            <Stack direction="column" spacing={3}>
              <Button
                onClick={handleCancelStrategy}
                isLoading={isLoading}
                data-testid="cancel-strategy-modal-cancel-button"
              >
                Cancel Strategy
              </Button>
              <Button variant="ghost" onClick={onClose} data-testid="cancel-strategy-modal-close-button">
                Back
              </Button>
            </Stack>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
