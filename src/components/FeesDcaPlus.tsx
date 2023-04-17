import {
  Box,
  Button,
  Collapse,
  Fade,
  Flex,
  Heading,
  Icon,
  Spacer,
  Spinner,
  Stack,
  Text,
  Image,
  useBoolean,
  HStack,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { ChevronDownIcon, ChevronUpIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { getPrettyFee } from '@helpers/getPrettyFee';
import useFiatPrice from '@hooks/useFiatPrice';
import { useDcaPlusConfirmForm } from '@hooks/useDcaPlusForm';
import { getSwapAmountFromDuration } from 'src/helpers/getSwapAmountFromDuration';
import { CREATE_VAULT_FEE, DELEGATION_FEE } from 'src/constants';
import { FormNames } from '@hooks/useFormStore';
import { getChainDexName } from '@helpers/chains';
import { useChain } from '@hooks/useChain';
import useDexFee from '@hooks/useDexFee';
import usePairs from '@hooks/usePairs';
import { findPair } from '@helpers/findPair';
import { OsmosisPair } from '@models/Pair';
import { TransactionType } from './TransactionType';

function FeeBreakdown({
  initialDenomName,
  swapAmount,
  price,
  dexFee,
}: {
  initialDenomName: string;
  swapAmount: number;
  price: number;
  dexFee: number;
}) {
  const [isOpen, { toggle }] = useBoolean(false);
  const { chain } = useChain();
  const { isOpen: isFeesModalOpen, onOpen: onFeesModalOpen, onClose: onFeesModalClose } = useDisclosure();

  return (
    <Stack position="relative" spacing={1}>
      <Box position="relative" w="min-content" zIndex={10} ml={isOpen ? 4 : 0}>
        <Box position="absolute" w="full" h="full" bg="darkGrey" />
        <Button
          rightIcon={<Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />}
          variant={isOpen ? 'ghost' : 'link'}
          size="xs"
          onClick={toggle}
          w="min-content"
        >
          Fee Breakdown
        </Button>
      </Box>
      <Box>
        <Fade in={isOpen}>
          <Box
            position="absolute"
            top={3}
            w="full"
            h="calc(100% - 16px)"
            borderColor="slateGrey"
            borderWidth={1}
            borderRadius="md"
          />
        </Fade>

        <Collapse in={isOpen}>
          <Stack direction="column" px={2} pb={4}>
            <Flex flexDirection="row" mt={0} gap={3}>
              <Flex flexGrow={1} flexDirection="column">
                <Heading size="xs">Once off</Heading>
                <Stack spacing={0}>
                  <Flex>
                    <Text textStyle="body-xs">Transaction fees:</Text>
                    <Spacer />
                    <Text textStyle="body-xs" as="span">
                      {' '}
                      {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                      {initialDenomName}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs">-</Text>
                    <Spacer />
                    <Text textStyle="body-xs">-</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs" textColor="white">
                      Total fees and tax:
                    </Text>
                    <Spacer />
                    <Text textStyle="body-xs" textColor="white" as="span">
                      {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />}{' '}
                      {initialDenomName}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
              <Flex flexGrow={1} flexDirection="column">
                <Heading size="xs">Per swap</Heading>
                <Stack spacing={0}>
                  <Flex>
                    <Text textStyle="body-xs">CALC sustainability tax:</Text>
                    <Spacer />
                    <Text textStyle="body-xs">FREE</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs">{getChainDexName(chain)} transaction fees:</Text>
                    <Spacer />
                    <Text textStyle="body-xs">
                      {getPrettyFee(swapAmount, dexFee)} {initialDenomName}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs" textColor="white">
                      Total fees per swap:
                    </Text>
                    <Spacer />
                    <Text textStyle="body-xs" textColor="white">
                      {getPrettyFee(swapAmount, dexFee)} {initialDenomName}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
            </Flex>
            <Stack>
              <Box color="green.200" fontSize="xs" bg="abyss.200" p={2} px={3} borderRadius="md">
                <HStack spacing={3}>
                  <Image src="/images/lightBulbOutlineGreen.svg" alt="light bulb" />
                  <Text onClick={onFeesModalOpen}>
                    A performance fee is charged ONLY when DCA+ outperforms traditional DCA and ONLY on the extra assets
                    acquired.
                    <Button variant="link" size="xs" colorScheme="green" onClick={onFeesModalOpen}>
                      <Icon as={QuestionOutlineIcon} />
                    </Button>
                  </Text>
                </HStack>
              </Box>
              <Flex flexGrow={1} flexDirection="column">
                <Heading size="xs">Performance fee</Heading>
                <Stack spacing={0}>
                  <Flex>
                    <Text textStyle="body-xs">Base fee</Text>
                    <Spacer />
                    <Text textStyle="body-xs">FREE</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs">Escrow</Text>
                    <Spacer />
                    <Text textStyle="body-xs">5% of swaps, returned if DCA+ underperforms.</Text>
                  </Flex>
                  <Flex>
                    <Text textStyle="body-xs" textColor="white">
                      Maximum possible fee:
                    </Text>
                    <Spacer />
                    <Text textStyle="body-xs" textColor="white">
                      20% of additional positive returns
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Collapse>
      </Box>
      <Modal isOpen={isFeesModalOpen} onClose={onFeesModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Performance free</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={8}>
              <Stack spacing={1}>
                <Image src="/images/performanceFee.svg" alt="performance fee" />
                <Text>Figure 1: A visual representation of a performance fee</Text>
              </Stack>
              <Stack spacing={1}>
                <Image src="/images/noPerformanceFee.svg" alt="no performance fee" />
                <Text>Figure 2: A visual representation of when no performance fees are charged</Text>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default function FeesDcaPlus({
  formName,
  transactionType,
}: {
  formName: FormNames;
  transactionType: TransactionType;
}) {
  const { state } = useDcaPlusConfirmForm(formName);
  const { price } = useFiatPrice(state?.initialDenom);

  const { initialDenom, autoStakeValidator, initialDeposit, strategyDuration, resultingDenom } = state || {};

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair =
    pairs && resultingDenom && initialDenom
      ? findPair(
          pairs,
          transactionType === TransactionType.Buy ? resultingDenom : initialDenom,
          transactionType === TransactionType.Buy ? initialDenom : resultingDenom,
        )
      : null;

  const { dexFee } = useDexFee((pair as OsmosisPair)?.route);

  // instead of returning any empty state on error, we could throw a validation error and catch it to display the
  // invalid data message, along with missing field info.
  if (!state) {
    return null;
  }

  const swapAmount = getSwapAmountFromDuration(initialDeposit!, strategyDuration!);

  const { name: initialDenomName } = getDenomInfo(initialDenom);

  return (
    <Stack spacing={0}>
      <Text textStyle="body-xs" as="span">
        Transaction fee{' '}
        <Text as="span" textColor="white">
          {price ? parseFloat((CREATE_VAULT_FEE / price).toFixed(3)) : <Spinner size="xs" />} {initialDenomName}
        </Text>{' '}
        +{' '}
        <Text as="span" textColor="white">
          {String.fromCharCode(8275)} {getPrettyFee(swapAmount, dexFee)} {initialDenomName}
        </Text>
        {autoStakeValidator && <Text as="span"> &amp; {DELEGATION_FEE * 100}% auto staking fee</Text>} per swap +
        performance fee
      </Text>

      <FeeBreakdown initialDenomName={initialDenomName} swapAmount={swapAmount} price={price} dexFee={dexFee} />
    </Stack>
  );
}
