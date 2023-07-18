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
import { getStrategyInitialDenomId, getStrategyResultingDenom } from '@helpers/strategy';
import { getStandardDcaEndDate, getEscrowAmount } from '@helpers/strategy/dcaPlus';
import { Strategy } from '@models/Strategy';
import { convertDenomFromCoin } from '@utils/getDenomInfo';
import useCancelStrategy from 'src/hooks/useCancelStrategy';
import { formatDate } from '@helpers/format/formatDate';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { useDenom } from '@hooks/useDenom/useDenom';

type CancelStrategyModalProps = {
  strategy: Strategy;
  onCancel: () => void;
} & Omit<ModalProps, 'children'>;

export default function CancelStrategyModal({ isOpen, onClose, onCancel, strategy }: CancelStrategyModalProps) {
  const initialDenom = useDenom(getStrategyInitialDenomId(strategy));
  const { mutate: cancelStrategy, isLoading } = useCancelStrategy();

  const toast = useToast();

  const { data: events, isLoading: isEventsLoading } = useStrategyEvents(strategy.id, isOpen);

  const handleCancelStrategy = () =>
    cancelStrategy(strategy, {
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
                  {convertDenomFromCoin(strategy.rawData.balance)} {initialDenom.name}
                </Text>
              </Flex>
              {isDcaPlus(strategy) && (
                <Flex align="center">
                  <Heading size="sm">Amount escrowed:</Heading>
                  <Spacer />
                  <Text as="span" fontSize="lg" color="blue.200">
                    {getEscrowAmount(strategy)} {getStrategyResultingDenom(strategy).name}
                  </Text>
                </Flex>
              )}
            </Stack>
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
                      {formatDate(getStandardDcaEndDate(strategy, events))}
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
