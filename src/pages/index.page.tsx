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
  Spacer,
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
import TopPanel from '@components/TopPanel';
import { useChain } from '@hooks/useChain';
import React, { Suspense } from 'react';
import { Chains } from '@hooks/useChain/Chains';
import { useSupportedDenoms } from '@hooks/useSupportedDenoms';
import { useStrategies } from '@hooks/useStrategies';
import { featureFlags } from 'src/constants';
import { BarChartIcon } from '@fusion-icons/react/interface';
import { getTotalSwapped, totalFromCoins } from './stats-and-totals/index.page';

const LinkWithQuery = React.lazy(() => import('@components/LinkWithQuery'));

function InfoPanel() {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4} alignItems="center">
      <Image src="/images/iceblock.svg" boxSize={10} />
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
            <Suspense>
              <LinkWithQuery href="/create-strategy">
                <Button w={44} variant="outline" colorScheme="blue">
                  {activeStrategies.length ? 'Create new strategy' : 'Set up a strategy'}
                </Button>
              </LinkWithQuery>
            </Suspense>
            {Boolean(activeStrategies.length) && (
              <Suspense>
                <LinkWithQuery href="/strategies">
                  <Button w={44} variant="outline" colorScheme="blue">
                    Review my strategies
                  </Button>
                </LinkWithQuery>
              </Suspense>
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
      <Heading size="md">How much is CALC reducing stress and saving time?</Heading>
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

function WorkflowPanel() {
  return (
    <VStack p={8} spacing={4}>
      <Heading size="sm">Effortlessly invest in your favorite crypto assets from your savings.</Heading>
      <Heading size="xs">Recurring payments means no stress. Set & forget.</Heading>
      <Image src="/images/workflow.svg" alt="workflow-image" />
    </VStack>
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
      bgSize="cover"
      h="full"
      w="full"
    >
      <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={1}>
        <Heading size="md">Ready to set up a CALC strategy?</Heading>
        <Text fontSize="sm">Set up smart recurring swaps such as DCA or Weighted Scale in just 30 seconds.</Text>
      </Stack>
      <Suspense>
        <LinkWithQuery passHref href="/create-strategy">
          <Button w={44} variant="outline" size="sm">
            Get started
          </Button>
        </LinkWithQuery>
      </Suspense>
    </VStack>
  );
}

export function LearnAboutCalcPanel() {
  return (
    <VStack
      layerStyle="panel"
      p={8}
      alignItems="left"
      borderColor="green.400"
      borderWidth={2}
      backgroundImage="/images/backgrounds/twist-thin.svg"
      bgSize="cover"
      h="full"
      w="full"
    >
      <Image src="images/learn.svg" alt="learn-icon" boxSize={8} />

      <Flex>
        <Stack spacing={4}>
          <HStack>
            <Heading data-testid="active-strategy-count" size="lg">
              New to CALC?
            </Heading>
            <Spacer />
          </HStack>
          <Heading data-testid="active-strategy-count" fontSize="md">
            Get to know more about our extensive suite of DeFi products.
          </Heading>
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <Suspense>
              <LinkWithQuery href="/learn-about-calc">
                <Button w={44} variant="outline" color="green.400">
                  Learn how CALC works
                </Button>
              </LinkWithQuery>
            </Suspense>
          </Stack>
        </Stack>{' '}
      </Flex>
    </VStack>
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
          {featureFlags.learningHubEnabled ? <OnboardingPanel /> : <WorkflowPanel />}
        </GridItem>
      )}
      <GridItem colSpan={{ base: 6, xl: 3 }}>{chain !== Chains.Moonbeam && <TotalInvestment />}</GridItem>
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
