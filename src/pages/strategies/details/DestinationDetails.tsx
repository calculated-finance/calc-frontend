import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Heading,
  GridItem,
  Text,
  Badge,
  Button,
  Link as ChakraLink,
  Icon,
  useClipboard,
  useToast,
  Flex,
  Spinner,
  Code,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  ModalProps,
} from '@chakra-ui/react';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { useWallet } from '@hooks/useWallet';
import { getMarsUrl } from '@helpers/chains';
import { useChain } from '@hooks/useChain';
import { truncate } from '@components/CosmosWallet';
import {
  getStrategyPostSwapType,
  getStrategyReinvestStrategyId,
  getStrategyValidatorAddress,
} from '@helpers/destinations';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { generateStrategyConfigureUrl } from '@components/TopPanel/generateStrategyConfigureUrl';
import { isStrategyCancelled, getStrategyResultingDenom } from '@helpers/strategy';
import useStrategy from '@hooks/useStrategy';
import useValidator from '@hooks/useValidator';
import { isV2Enabled } from '@helpers/version/isV2Enabled';
import { getDenomName } from '@utils/getDenomInfo';
import { HiOutlineCube } from 'react-icons/hi';
import Link from 'next/link';
import { LoopingStrategyDetails } from '@components/LoopingStrategyDetails';
import { BoxedExportIcon } from '@fusion-icons/react/interface';

function LoopingDetailsModal({
  strategy,
  isOpen,
  onClose,
}: { strategy: StrategyOsmosis } & Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Looping Strategy Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack justify="center" gap={6} align="center">
            <LoopingStrategyDetails strategy={strategy} />
            {/* <Link isExternal href={`/strategies/details/?id=${strategy.id}`}> */}
            <Button variant="outline" rightIcon={<Icon as={BoxedExportIcon} stroke="brand.200" fontSize="md" />}>
              Go to strategy
            </Button>
            {/* </Link> */}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function ConfigureButton({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { chain } = useChain();
  const { address } = useWallet();
  return (
    <GridItem visibility={isStrategyCancelled(strategy) || !isV2Enabled(chain, address) ? 'hidden' : 'visible'}>
      <Flex justify="end">
        <Link href={generateStrategyConfigureUrl(strategy.id)}>
          <Button size="xs" variant="ghost" colorScheme="brand" leftIcon={<Icon fontSize="md" as={HiOutlineCube} />}>
            Configure
          </Button>
        </Link>
      </Flex>
    </GridItem>
  );
}

export function ReinvestDetails({ strategy }: { strategy: StrategyOsmosis }) {
  const id = getStrategyReinvestStrategyId(strategy);
  const { data } = useStrategy(id);
  const { vault: reinvestStrategy } = data || {};
  const checkLoopedStrategy = reinvestStrategy && getStrategyReinvestStrategyId(reinvestStrategy);
  const isLooped = checkLoopedStrategy === strategy.id;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">{isLooped ? 'Looping into' : 'Reinvesting into'}</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        {!reinvestStrategy ? (
          <Spinner size="xs" />
        ) : (
          // <ChakraLink isExternal href={`/strategies/details/?id=${id}`}>
          <Text fontSize="sm" data-testid="strategy-receiving-address" as={ChakraLink}>
            <Code
              bg="abyss.200"
              fontSize="x-small"
              as={ChakraLink}
              color="blue.200"
              display={{ base: 'none', lg: 'contents' }}
              aria-label="More details"
              variant="ghost"
              onClick={onOpen}
            >
              {getDenomName(getStrategyResultingDenom(reinvestStrategy))} Strategy | id: {id} <ExternalLinkIcon />
            </Code>
            <Code
              bg="abyss.200"
              fontSize="xx-small"
              as={ChakraLink}
              color="blue.200"
              display={{ base: 'contents', lg: 'none' }}
              whiteSpace="nowrap"
              aria-label="More details"
              variant="ghost"
              onClick={onOpen}
            >
              {/* <ExternalLinkIcon /> */}
              id: {id}
            </Code>
          </Text>
          // </ChakraLink>
        )}
        <LoopingDetailsModal strategy={strategy} isOpen={isOpen} onClose={onClose} />
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  );
}

export function ValidatorDetails({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const validatorAddress = getStrategyValidatorAddress(strategy);
  const { validator, isLoading } = useValidator(validatorAddress);

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Auto staking status</Heading>
      </GridItem>
      <GridItem colSpan={2} data-testid="strategy-auto-staking-status">
        <Badge colorScheme="green">Active</Badge>
      </GridItem>
      <GridItem colSpan={1}>
        <Heading size="xs">Validator name</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-validator-name">
          {isLoading ? <Spinner size="sm" /> : validator?.description?.moniker}
        </Text>
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  );
}

export function DestinationDetails({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { destinations } = strategy;
  const { chain } = useChain();

  const { address } = useWallet();

  const { onCopy } = useClipboard(destinations[0].address || '');
  const toast = useToast();

  const postSwapExecutionType = getStrategyPostSwapType(strategy, chain);

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Address copied to clipboard',
      position: 'top',
      status: 'success',
      duration: 9000,
      isClosable: true,
      variant: 'subtle',
    });
  };

  if (postSwapExecutionType === PostPurchaseOptions.Stake) {
    return <ValidatorDetails strategy={strategy} />;
  }

  if (postSwapExecutionType === PostPurchaseOptions.GenerateYield) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Depositing to</Heading>
        </GridItem>
        <GridItem colSpan={1}>
          <ChakraLink isExternal href={getMarsUrl()}>
            <Text fontSize="sm">Mars</Text>
          </ChakraLink>
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  if (postSwapExecutionType === PostPurchaseOptions.Reinvest) {
    return <ReinvestDetails strategy={strategy as StrategyOsmosis} />;
  }

  if (destinations[0].address !== address) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Sending to </Heading>
        </GridItem>
        <GridItem colSpan={1}>
          <Button
            variant="link"
            colorScheme="blue"
            rightIcon={<Icon as={CopyIcon} />}
            fontSize="sm"
            data-testid="strategy-receiving-address"
            onClick={handleCopy}
          >
            {truncate(destinations[0].address)}
          </Button>
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  return isV2Enabled(chain, address) ? (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Post-swap action</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Badge>None</Badge>
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  ) : null;
}
