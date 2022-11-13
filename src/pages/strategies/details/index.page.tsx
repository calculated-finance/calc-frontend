import {
  Heading,
  Grid,
  GridItem,
  Box,
  Text,
  HStack,
  IconButton,
  Icon,
  Center,
  Flex,
  Image,
  Alert,
  useDisclosure,
  Spacer,
} from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import { ArrowRightIcon, CloseBoxedIcon } from '@fusion-icons/react/interface';
import useStrategy from '@hooks/useStrategy';
import getDenomInfo from '@utils/getDenomInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '@wizard-ui/react';
import useStrategyEvents, { Event } from '@hooks/useStrategyEvents';
import { getStrategyName } from 'src/helpers/getStrategyName';
import { Denom } from '@models/Denom';
import ConnectWallet from '@components/ConnectWallet';
import { findLastIndex } from 'lodash';
import { getSidebarLayout } from '../../../components/Layout';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import StrategyPerformance from './StrategyPerformance';
import StrategyDetails from './StrategyDetails';
import { NextSwapInfo } from './NextSwapInfo';

function Diagram({ initialDenom, resultingDenom }: { initialDenom: Denom; resultingDenom: Denom }) {
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  return (
    <HStack spacing={5}>
      <HStack>
        <DenomIcon size={5} denomName={initialDenom} />
        <Text>{initialDenomName}</Text>
      </HStack>
      <CalcIcon as={ArrowRightIcon} stroke="grey" />
      <HStack>
        <DenomIcon size={5} denomName={resultingDenom} />
        <Text>{resultingDenomName}</Text>
      </HStack>
    </HStack>
  );
}

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
          <Flex w={200}>
            <Diagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
          </Flex>
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
        <GridItem colSpan={6}>
          <Box layerStyle="panel">
            <Heading p={6} size="md">
              Portfolio accumulated with this strategy
            </Heading>
            {/* <Stat>
              <StatNumber>
                {getDenomInfo(resultingDenom).conversion(Number(0))} {getDenomInfo(resultingDenom).name}
              </StatNumber>
            </Stat> */}
            <Box position="relative">
              <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="2px">
                <Heading>Coming soon</Heading>
              </Center>
              <Image borderBottomRadius="2xl" w="full" h="full" src="/images/dummyChart.svg" />
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
