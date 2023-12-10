import {
  Button,
  Box,
  Heading,
  Text,
  Stack,
  Center,
  Image,
  Flex,
  Grid,
  GridItem,
  HStack,
  Divider,
  Wrap,
  VStack,
  Icon,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import useAllStrategies from '@hooks/useAllStrategies';
import { Strategy } from '@models/Strategy';
import getDenomInfo, { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useWallet } from '@hooks/useWallet';
import { getStrategyInitialDenom, isStrategyOperating, getStrategyResultingDenom } from '@helpers/strategy';
import { getSidebarLayout } from '@components/Layout';
import { useSupportedDenoms } from '@hooks/useSupportedDenoms';
import LinkWithQuery from '@components/LinkWithQuery';
import { useAnalytics } from '@hooks/useAnalytics';
import { useStrategies } from '@hooks/useStrategies';
import { CrownIcon, KnowledgeIcon, DropIcon } from '@fusion-icons/react/interface';
import useFiatPrices from '@hooks/useFiatPrices';
import { getTotalSwapped, totalFromCoins } from './stats-and-totals/index.page';
import SimpleDcaIn from '@components/SimpleDcaInForm';

function WarningPanel() {
  return (
    <Stack direction="row" layerStyle="panel" px={8} py={8} spacing={4} h="full">
      <Image src="/images/warning.svg" />
      <Flex alignItems="center" p={4}>
        <Text textStyle="body">
          <Text as="span" fontWeight="bold" color="white">
            Be Aware:
          </Text>{' '}
          Crypto markets often experience similar behavioral herding. Most investors blindly mimic the behavior of other
          investors without seeking the rationality behind it. As asset prices pump and valuation metrics get stretched,
          FOMO strengthens. People grow impatient watching Twitter users and friends make “easy” money. One by one,
          reluctant investors join the herd despite their concerns.
        </Text>
      </Flex>
    </Stack>
  );
}

const isStrategyAcculumating = (strategy: Strategy) => isDenomStable(getStrategyInitialDenom(strategy));

const isStrategyProfitTaking = (strategy: Strategy) => isDenomVolatile(getStrategyInitialDenom(strategy));

function InvestmentThesisWithActiveStrategies({
  strategies,
  isLoading,
}: {
  strategies: Strategy[] | undefined;
  isLoading: boolean;
}) {
  const activeStrategies = strategies?.filter(isStrategyOperating) ?? [];
  const acculumatingAssets = Array.from(
    new Set(activeStrategies.filter(isStrategyAcculumating).map((strategy) => getStrategyResultingDenom(strategy).id)),
  ).map((id) => getDenomInfo(id));

  const profitTakingAssets = Array.from(
    new Set(activeStrategies.filter(isStrategyProfitTaking).map((strategy) => getStrategyInitialDenom(strategy).id)),
  ).map((id) => getDenomInfo(id));
  return (
    <Flex layerStyle="panel" p={8} alignItems="center" h="full">
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          <HStack spacing={2}>
            <Icon as={CrownIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
            <Heading size="md">My investment thesis:</Heading>
          </HStack>
          <Flex direction="row" gap={8}>
            <Stack direction="column">
              <Heading size="xs" textColor="gray.200">
                My active CALC strategies:
              </Heading>
              <Heading size="2xl"> {activeStrategies.length}</Heading>
            </Stack>
            <Stack spacing={6}>
              <Wrap spacingX={6} spacingY={2} align="center">
                <Text>Asset(s) accumulating:</Text>
                <HStack>
                  {acculumatingAssets.length ? (
                    acculumatingAssets.map((asset) => (
                      <DenomIcon size={6} showTooltip key={asset.id} denomInfo={asset} />
                    ))
                  ) : (
                    <Text>-</Text>
                  )}
                </HStack>
              </Wrap>
              <Wrap spacingX={6} spacingY={2} align="center">
                <Text>Asset(s) taking profit on:</Text>
                <HStack>
                  {profitTakingAssets.length ? (
                    profitTakingAssets.map((asset) => (
                      <DenomIcon size={6} showTooltip key={asset.id} denomInfo={asset} />
                    ))
                  ) : (
                    <Text>-</Text>
                  )}
                </HStack>
              </Wrap>
            </Stack>
          </Flex>
        </Stack>
      )}
    </Flex>
  );
}

function TotalInvestment() {
  const supportedDenoms = useSupportedDenoms();
  const { fiatPrices: prices } = useFiatPrices();
  const { data: allStrategies } = useAllStrategies();

  if (!prices || !allStrategies) {
    return (
      <Center layerStyle="panel" p={8} h="full">
        <Spinner />
      </Center>
    );
  }

  const totalSwappedAmounts = getTotalSwapped(allStrategies, supportedDenoms);
  const totalSwappedTotal = totalFromCoins(totalSwappedAmounts, prices, supportedDenoms);

  const formattedValue =
    totalSwappedTotal >= 1000000
      ? `$${(totalSwappedTotal / 1000000).toFixed(3)}m`
      : `$${Math.floor(totalSwappedTotal / 1000)}k`;

  return (
    <Stack layerStyle="panel" p={8} h="full" spacing={6}>
      <HStack spacing={2}>
        <Icon as={DropIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
        <Heading size="md">How much is CALC reducing stress and saving time?</Heading>
      </HStack>
      <Flex gap={12} direction={['column', null, 'row']}>
        <Stack spacing={4}>
          <Heading data-testid="active-strategy-count" fontSize="5xl">
            {allStrategies.length}
            <Text fontSize="md">total strategies created</Text>
          </Heading>
        </Stack>
        <Divider display={['none', null, 'flex']} orientation="vertical" />
        <Divider display={['flex', null, 'none']} />
        <Stack spacing={4}>
          <Heading data-testid="active-strategy-count" fontSize="5xl">
            {formattedValue}
            <Text fontSize="md">total swapped (USD)</Text>
          </Heading>
        </Stack>
      </Flex>
    </Stack>
  );
}

export function LearnAboutCalcPanel() {
  const { track } = useAnalytics();

  return (
    <Box layerStyle="panel" p={8} backgroundImage="/images/backgrounds/twist-thin-blue.svg" backgroundSize="cover">
      <VStack alignItems="left" spacing={8}>
        <HStack>
          <Icon as={KnowledgeIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
          <Heading size="md">New to CALC?</Heading>
        </HStack>
        <Stack spacing={1}>
          <Text fontSize="sm">
            Find out why people are raving about their experiences leveraging CALC to make smarter swaps.
          </Text>
          <Text fontSize="sm" textStyle="body">
            DCA | DCA+ | Weighted Scale
          </Text>
        </Stack>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <LinkWithQuery passHref href="/learn-about-calc">
            <Button
              px={12}
              maxWidth={402}
              size="sm"
              bgColor="blue.200"
              _hover={{ bgColor: 'blue.300' }}
              onClick={() => track('Learning hub button clicked')}
            >
              Learn how CALC works
            </Button>
          </LinkWithQuery>
        </Stack>
      </VStack>
    </Box>
  );
}

function HomeGrid() {
  const { connected } = useWallet();
  const { data: strategies, isLoading } = useStrategies();

  const activeStrategies = strategies?.filter(isStrategyOperating) ?? [];

  return (
    <Grid gap={4} templateColumns="repeat(10, 1fr)" templateRows="repeat(3, 1fr)" alignItems="stretch">
      <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={3}>
        <SimpleDcaIn />
      </GridItem>

      {Boolean(activeStrategies.length) && (
        <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
          <InvestmentThesisWithActiveStrategies strategies={strategies} isLoading={isLoading} />
        </GridItem>
      )}

      <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
        <TotalInvestment />
      </GridItem>

      <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
        <LearnAboutCalcPanel />
      </GridItem>
      {(!connected || activeStrategies.length === 0) && (
        <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
          <WarningPanel />{' '}
        </GridItem>
      )}
    </Grid>
  );
}

function Home() {
  return (
    <>
      <Box pb={8}>
        <Heading size="lg" mb={2}>
          Welcome to CALC, you&apos;ve made a great choice!
        </Heading>
        <Text textStyle="body">
          Stop being glued to a computer screen 24/7, define your strategy up front, and leave the rest to CALC.
        </Text>
      </Box>
      <HomeGrid />
    </>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
