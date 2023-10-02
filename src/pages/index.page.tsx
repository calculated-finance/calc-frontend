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
import useAdminStrategies from '@hooks/useAdminStrategies';
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@models/Strategy';
import getDenomInfo, { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useWallet } from '@hooks/useWallet';
import { getStrategyInitialDenom, isStrategyOperating, getStrategyResultingDenom } from '@helpers/strategy';
import { getSidebarLayout } from '@components/Layout';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { useSupportedDenoms } from '@hooks/useSupportedDenoms';
import LinkWithQuery from '@components/LinkWithQuery';
import { useAnalytics } from '@hooks/useAnalytics';
import { useStrategies } from '@hooks/useStrategies';
import { BarChartIcon, CrownIcon, KnowledgeIcon, DropIcon } from '@fusion-icons/react/interface';
import TopPanel from '@components/TopPanel';
import SimpleDcaIn from '@components/SimpleDcaInForm';
import { getTotalSwapped, totalFromCoins } from './stats-and-totals/index.page';
import { useAdmin } from '@hooks/useAdmin';

function InfoPanel() {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text textStyle="body">
          Stay ice cold and calculated by using Calculated Finance &ndash; the smartest way to enter and exit positions
          &ndash; complimented with pre- and post-swap automation to save time and counter emotional decision-making.
        </Text>
      </Flex>
    </Stack>
  );
}

function WarningPanel() {
  return (
    <Stack direction="row" layerStyle="panel" px={8} py={4} spacing={4}>
      <Image src="/images/warning.svg" />
      <Flex alignItems="center">
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

function InvestmentThesis({ strategies, isLoading }: { strategies: Strategy[] | undefined; isLoading: boolean }) {
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
          <Heading size="md">My thesis:</Heading>
          <Heading size="xs">
            <Wrap spacingX={6} spacingY={2} align="center">
              <Text>Asset(s) accumulating:</Text>
              <HStack>
                {acculumatingAssets.length ? (
                  acculumatingAssets.map((asset) => <DenomIcon size={6} showTooltip key={asset.id} denomInfo={asset} />)
                ) : (
                  <Text>-</Text>
                )}
              </HStack>
            </Wrap>
          </Heading>
          <Heading size="xs">
            <Wrap spacingX={6} spacingY={2} align="center">
              <Text>Asset(s) taking profit on:</Text>
              <HStack>
                {profitTakingAssets.length ? (
                  profitTakingAssets.map((asset) => <DenomIcon size={6} showTooltip key={asset.id} denomInfo={asset} />)
                ) : (
                  <Text>-</Text>
                )}
              </HStack>
            </Wrap>
          </Heading>
        </Stack>
      )}
    </Flex>
  );
}
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

function ActiveStrategies({ strategies, isLoading }: { strategies: Strategy[] | undefined; isLoading: boolean }) {
  const { connected } = useWallet();
  const activeStrategies = strategies?.filter(isStrategyOperating) ?? [];
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      {connected && isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          <Heading size="md">My active CALC strategies</Heading>
          <Heading data-testid="my-active-strategy-count" fontSize="5xl">
            {activeStrategies.length}
          </Heading>
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <LinkWithQuery href="/create-strategy">
              <Button w={44} variant="outline" colorScheme="blue">
                {activeStrategies.length ? 'Create new strategy' : 'Set up a strategy'}
              </Button>
            </LinkWithQuery>
            {Boolean(activeStrategies.length) && (
              <LinkWithQuery href="/strategies">
                <Button w={44} variant="outline" colorScheme="blue">
                  Review my strategies
                </Button>
              </LinkWithQuery>
            )}
          </Stack>
        </Stack>
      )}
    </Flex>
  );
}

function TotalInvestment() {
  const kujiraSupportedDenoms = useSupportedDenoms(Chains.Kujira);
  const osmosisSupportedDenoms = useSupportedDenoms(Chains.Osmosis);
  const { data: fiatPrices } = useFiatPrice(kujiraSupportedDenoms[0], [
    ...kujiraSupportedDenoms,
    ...osmosisSupportedDenoms,
  ]);
  const { data: kujiraStrategies } = useAdminStrategies(Chains.Kujira);
  const { data: osmosisStrategies } = useAdminStrategies(Chains.Osmosis);

  if (!fiatPrices || !kujiraStrategies || !osmosisStrategies) {
    return (
      <Center layerStyle="panel" p={8} h="full">
        <Spinner />
      </Center>
    );
  }

  const totalSwappedAmountsKujira = getTotalSwapped(kujiraStrategies, kujiraSupportedDenoms);
  const totalSwappedTotalKujira = totalFromCoins(
    totalSwappedAmountsKujira,
    fiatPrices,
    kujiraSupportedDenoms,
    Chains.Kujira,
  );

  const totalSwappedAmountsOsmosis = getTotalSwapped(osmosisStrategies, osmosisSupportedDenoms);
  const totalSwappedTotalOsmosis = totalFromCoins(
    totalSwappedAmountsOsmosis,
    fiatPrices,
    osmosisSupportedDenoms,
    Chains.Osmosis,
  );
  const strategiesCount = kujiraStrategies.length + osmosisStrategies.length;

  const totalSwappedTotal = totalSwappedTotalOsmosis + totalSwappedTotalKujira;

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
            {strategiesCount}
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

function OnboardingPanel() {
  return (
    <VStack
      layerStyle="panel"
      p={8}
      alignItems="left"
      borderColor="brand.200"
      borderWidth={2}
      backgroundImage="/images/backgrounds/twist-thin.svg"
    >
      <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={1}>
        <Heading size="md">Ready to set up a CALC strategy?</Heading>
        <Text fontSize="sm">Set up smart recurring swaps such as DCA or Weighted Scale in just 30 seconds.</Text>
      </Stack>
      <LinkWithQuery passHref href="/create-strategy">
        <Button w={44} variant="outline" size="sm">
          Get started
        </Button>
      </LinkWithQuery>
    </VStack>
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
  const { chain } = useChain();
  const { data: strategies, isLoading } = useStrategies();

  const activeStrategies = strategies?.filter(isStrategyOperating) ?? [];

  return (
    <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch">
      <TopPanel />
      {Boolean(activeStrategies.length) && (
        <GridItem colSpan={{ base: 6, lg: 2 }} h="full">
          <InvestmentThesis strategies={strategies} isLoading={isLoading} />
        </GridItem>
      )}

      <GridItem colSpan={{ base: 6 }}>{activeStrategies.length ? <WarningPanel /> : <InfoPanel />}</GridItem>
      {connected && activeStrategies.length ? (
        <GridItem colSpan={{ base: 6, lg: 6, xl: 3 }}>
          <ActiveStrategies strategies={strategies} isLoading={isLoading} />
        </GridItem>
      ) : (
        ''
      )}
      {(!activeStrategies.length || !connected) && (
        <GridItem colSpan={{ base: 6, lg: 6, xl: 3 }}>
          <OnboardingPanel />
        </GridItem>
      )}
      <GridItem colSpan={{ base: 6, xl: 3 }}>{chain !== Chains.Moonbeam && <TotalInvestment />}</GridItem>
    </Grid>
  );
}

function HomeGridSimpleDca() {
  const { connected } = useWallet();
  const { chain } = useChain();
  const { data: strategies, isLoading } = useStrategies();

  const activeStrategies = strategies?.filter(isStrategyOperating) ?? [];

  return (
    <Grid gap={6} mb={6} templateColumns="repeat(10, 1fr)" templateRows="repeat(3, 1fr)" alignItems="stretch">
      <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={3} minWidth={451}>
        <SimpleDcaIn />
      </GridItem>

      {Boolean(activeStrategies.length) && (
        <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
          <InvestmentThesisWithActiveStrategies strategies={strategies} isLoading={isLoading} />
        </GridItem>
      )}

      <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
        {chain !== Chains.Moonbeam && <TotalInvestment />}
      </GridItem>

      <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
        <LearnAboutCalcPanel />
      </GridItem>
      {!connected && (
        <GridItem colSpan={[10, 10, 10, 10, 5, 5]} rowSpan={1}>
          <WarningPanel />{' '}
        </GridItem>
      )}
    </Grid>
  );
}

function Home() {
  const { isAdmin } = useAdmin();
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
      {isAdmin ? <HomeGridSimpleDca /> : <HomeGrid />}
    </>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
