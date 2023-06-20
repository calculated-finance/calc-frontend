import 'isomorphic-fetch';
import {
  Heading,
  Grid,
  Text,
  HStack,
  IconButton,
  Icon,
  Center,
  Image,
  Alert,
  useDisclosure,
  Spacer,
} from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import Spinner from '@components/Spinner';
import { CloseBoxedIcon } from '@fusion-icons/react/interface';
import useStrategy from '@hooks/useStrategy';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '@hooks/useWallet';
import useStrategyEvents, { StrategyEvent } from '@hooks/useStrategyEvents';
import ConnectWallet from '@components/ConnectWallet';
import { findLastIndex } from 'lodash';
import {
  PREVIOUS_SWAP_FAILED_DUE_TO_INSUFFICIENT_FUNDS_ERROR_MESSAGE,
  PREVIOUS_SWAP_FAILED_DUE_TO_SLIPPAGE_ERROR_MESSAGE,
} from 'src/constants';
import { Strategy } from '@models/Strategy';
import { getStrategyName } from '@helpers/strategy';
import { getSidebarLayout } from '@components/Layout';
import { formatDate } from '@helpers/format/formatDate';
import { getStandardDcaEndDate, isEscrowPending } from '@helpers/strategy/dcaPlus';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import LinkWithQuery from '@components/LinkWithQuery';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import StrategyPerformance from './StrategyPerformance';
import StrategyDetails from './StrategyDetails';
import StrategyComparison from './StrategyComparison';
import { NextSwapInfo } from './NextSwapInfo';
import { StrategyChart } from './StrategyChart';
import { StrategyComparisonChart } from './StrategyComparisonChart';

export function getLatestSwapError(strategy: Strategy, events: StrategyEvent[] | undefined): string | undefined {
  if (!events) {
    return undefined;
  }
  const executionTriggeredIndex = findLastIndex(events, (event) => {
    const { data } = event;
    if ('dca_vault_execution_triggered' in data) {
      return true;
    }
    return false;
  });

  const executionSkippedIndex = executionTriggeredIndex + 1;

  if (executionTriggeredIndex === -1 || executionSkippedIndex >= events.length) {
    return undefined;
  }

  const { data } = events[executionSkippedIndex];

  if (!('dca_vault_execution_skipped' in data)) return undefined;

  const swapReasonMessages: Record<string, string> = {
    slippage_tolerance_exceeded: PREVIOUS_SWAP_FAILED_DUE_TO_SLIPPAGE_ERROR_MESSAGE,
    unknown_failure: PREVIOUS_SWAP_FAILED_DUE_TO_INSUFFICIENT_FUNDS_ERROR_MESSAGE,
  };

  const swapSkippedReason = data.dca_vault_execution_skipped?.reason.toString();

  return (
    (Object.keys(swapReasonMessages).includes(swapSkippedReason) && swapReasonMessages[swapSkippedReason]) || undefined
  );
}

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data: strategy } = useStrategy(id as string);
  const { data: events } = useStrategyEvents(id as string);
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  const { connected } = useWallet();

  if (!connected) {
    return <ConnectWallet layerStyle="panel" />;
  }

  if (!strategy) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }
  const lastSwapSlippageError = getLatestSwapError(strategy, events);

  return (
    <>
      <HStack spacing={6} pb={6}>
        <LinkWithQuery href="/strategies">
          <IconButton aria-label="back" variant="outline">
            <Icon as={FiArrowLeft} stroke="brand.200" />
          </IconButton>
        </LinkWithQuery>

        <HStack spacing={8} alignItems="center">
          <Heading data-testid="details-heading">{getStrategyName(strategy)}</Heading>
        </HStack>
      </HStack>

      {isEscrowPending(strategy) && (
        <Alert status="warning" mb={8} borderWidth={1} borderColor="green.200">
          <Image mr={4} src="/images/lightBulbOutlineGreen.svg" />
          <Text fontSize="sm" mr={4}>
            Your strategy is now inactive and you will receive your escrow (minus performance fee) on{' '}
            {formatDate(getStandardDcaEndDate(strategy, events))}.
          </Text>
        </Alert>
      )}

      {Boolean(lastSwapSlippageError) && isVisible && (
        <Alert status="warning" mb={8} borderWidth={1} borderColor="yellow.200">
          <Image mr={4} src="/images/warningIcon.svg" />
          <Text fontSize="sm" mr={4}>
            {lastSwapSlippageError}
          </Text>
          <Spacer />

          <CalcIcon as={CloseBoxedIcon} stroke="white" onClick={onClose} />
        </Alert>
      )}

      <NextSwapInfo strategy={strategy} />

      <Grid
        gap={6}
        mb={6}
        templateColumns="repeat(6, 1fr)"
        templateRows={isDcaPlus(strategy) ? '3fr' : '2fr'}
        alignItems="stretch"
      >
        {isDcaPlus(strategy) && <StrategyComparison strategy={strategy} />}
        <StrategyDetails strategy={strategy} />
        <StrategyPerformance strategy={strategy} />
        {isDcaPlus(strategy) && <StrategyComparisonChart strategy={strategy} />}
        <StrategyChart strategy={strategy} />
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
