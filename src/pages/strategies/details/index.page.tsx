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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '@hooks/useWallet';
import useStrategyEvents from '@hooks/useStrategyEvents';
import ConnectWallet from '@components/ConnectWallet';
import { getStrategyName } from '@helpers/strategy';
import { getSidebarLayout } from '@components/Layout';
import { formatDate } from '@helpers/format/formatDate';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import { useDecoratedStrategy } from '@hooks/useDecoratedStrategy';
import StrategyPerformance from './StrategyPerformance';
import StrategyDetails from './StrategyDetails';
import StrategyComparison from './StrategyComparison';
import { NextSwapInfo } from './NextSwapInfo';
import { StrategyChart } from './StrategyChart';
import { StrategyComparisonChart } from './StrategyComparisonChart';

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { strategy } = useDecoratedStrategy(id as string);
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
  const lastSwapSlippageError = strategy.getLatestSwapError;

  return (
    <>
      <HStack spacing={6} pb={6}>
        <Link href="/strategies">
          <IconButton aria-label="back" variant="outline">
            <Icon as={FiArrowLeft} stroke="brand.200" />
          </IconButton>
        </Link>

        <HStack spacing={8} alignItems="center">
          <Heading data-testid="details-heading">{getStrategyName(strategy)}</Heading>
        </HStack>
      </HStack>

      {strategy.isEscrowPending && (
        <Alert status="warning" mb={8} borderWidth={1} borderColor="green.200">
          <Image mr={4} src="/images/lightBulbOutlineGreen.svg" />
          <Text fontSize="sm" mr={4}>
            Your strategy is now inactive and you will receive your escrow (minus performance fee) on{' '}
            {formatDate(strategy.getStandardDcaEndDate)}.
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
        templateRows={strategy.isDcaPlus ? '3fr' : '2fr'}
        alignItems="stretch"
      >
        {strategy.isDcaPlus && <StrategyComparison strategy={strategy} />}
        <StrategyDetails strategy={strategy} />
        <StrategyPerformance strategy={strategy} />
        {strategy.isDcaPlus && <StrategyComparisonChart strategy={strategy} />}
        <StrategyChart strategy={strategy} />
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
