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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '@wizard-ui/react';
import useStrategyEvents, { Event } from '@hooks/useStrategyEvents';
import { getStrategyName } from 'src/helpers/getStrategyName';
import ConnectWallet from '@components/ConnectWallet';
import { findLastIndex } from 'lodash';
import { getSidebarLayout } from '../../../components/Layout';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import StrategyPerformance from './StrategyPerformance';
import StrategyDetails from './StrategyDetails';
import { NextSwapInfo } from './NextSwapInfo';
import { StrategyChart } from './StrategyChart';

function didLastSwapHaveSlippageError(events: Event[] | undefined) {
  if (!events) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const executionTriggeredIndex = findLastIndex(events, (event) => event.data.dca_vault_execution_triggered);

  const executionSkippedIndex = executionTriggeredIndex + 1;

  if (executionTriggeredIndex === -1 || executionSkippedIndex >= events.length) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (events[executionSkippedIndex]?.data.dca_vault_execution_skipped?.reason === 'slippage_tolerance_exceeded') {
    return true;
  }

  return false;
}

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useStrategy(id as string);
  const { data: eventsData } = useStrategyEvents(id as string);

  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  const { connected } = useWallet();

  if (!connected) {
    return <ConnectWallet layerStyle="panel" />;
  }

  const events = eventsData?.events;

  const lastSwapSlippageError = didLastSwapHaveSlippageError(events);

  if (!data) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  const initialDenom = getStrategyInitialDenom(data.vault);
  const resultingDenom = getStrategyResultingDenom(data.vault);

  return (
    <>
      <HStack spacing={6} pb={6}>
        <Link href="/strategies">
          <IconButton aria-label="back" variant="outline">
            <Icon as={FiArrowLeft} stroke="brand.200" />
          </IconButton>
        </Link>

        <HStack spacing={8} alignItems="center">
          <Heading data-testid="details-heading">{getStrategyName(data.vault)}</Heading>
        </HStack>
      </HStack>

      {Boolean(lastSwapSlippageError) && isVisible && (
        <Alert status="warning" mb={8} borderWidth={1} borderColor="yellow.200">
          <Image mr={4} src="/images/warningIcon.svg" />
          <Text fontSize="sm" mr={4}>
            The previous swap failed due to slippage being exceeded - your funds are safe, and the next swap is
            scheduled.
          </Text>
          <Spacer />

          <CalcIcon as={CloseBoxedIcon} stroke="white" onClick={onClose} />
        </Alert>
      )}

      <NextSwapInfo strategy={data.vault} />

      <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="2fr" alignItems="stretch">
        <StrategyDetails strategy={data.vault} />
        <StrategyPerformance strategy={data.vault} />
        <StrategyChart strategy={data.vault} />
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
