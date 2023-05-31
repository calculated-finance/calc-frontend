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
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import useAdminStrategies from '@hooks/useAdminStrategies';
import useFiatPrice from '@hooks/useFiatPrice';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import { isDenomStable, isDenomVolatile } from '@utils/getDenomInfo';
import { useWallet } from '@hooks/useWallet';
import Link from 'next/link';
import { getStrategyInitialDenom, isStrategyOperating, getStrategyResultingDenom } from '@helpers/strategy';
import { getSidebarLayout } from '@components/Layout';
import TopPanel from '@components/TopPanel';
import { Chains, useChain } from '@hooks/useChain';
import { useSupportedDenoms } from '@hooks/useSupportedDenoms';
import { useAnalytics } from '@hooks/useAnalytics';
import { useEffect } from 'react';
import { getTotalSwapped, totalFromCoins } from './stats-and-totals/index.page';

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

function InvestmentThesis() {
  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
  const acculumatingAssets = Array.from(
    new Set(activeStrategies.filter(isStrategyAcculumating).map(getStrategyResultingDenom)),
  );

  const profitTakingAssets = Array.from(
    new Set(activeStrategies.filter(isStrategyProfitTaking).map(getStrategyInitialDenom)),
  );
  return (
    <Flex layerStyle="panel" p={8} alignItems="center" h="full">
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          <Heading size="md">My investment thesis:</Heading>
          <Heading size="xs">
            <Wrap spacingX={6} spacingY={2} align="center">
              <Text>Asset(s) accumulating:</Text>
              <HStack>
                {acculumatingAssets.length ? (
                  acculumatingAssets.map((asset) => <DenomIcon size={6} showTooltip key={asset} denomName={asset} />)
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
                  profitTakingAssets.map((asset) => <DenomIcon size={6} showTooltip key={asset} denomName={asset} />)
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

function ActiveStrategies() {
  const { data, isLoading } = useStrategies();
  const { connected } = useWallet();
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      {connected && isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          <Heading size="md">My active CALC strategies</Heading>
          <Heading data-testid="active-strategy-count" fontSize="5xl">
            {activeStrategies.length}
          </Heading>
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <Link href="/create-strategy">
              <Button w={44} variant="outline" colorScheme="blue">
                {activeStrategies.length ? 'Create new strategy' : 'Set up a strategy'}
              </Button>
            </Link>
            {Boolean(activeStrategies.length) && (
              <Link href="/strategies">
                <Button w={44} variant="outline" colorScheme="blue">
                  Review my strategies
                </Button>
              </Link>
            )}
          </Stack>
        </Stack>
      )}
    </Flex>
  );
}

function TotalInvestment() {
  const supportedDenoms = useSupportedDenoms();
  const { data: fiatPrices } = useFiatPrice(supportedDenoms[0]);
  const { data } = useAdminStrategies();
  const { connected } = useWallet();
  const { chain } = useChain();

  if (!fiatPrices || !data) {
    return (
      <Center layerStyle="panel" p={8} h="full">
        <Spinner />
      </Center>
    );
  }

  const totalSwappedAmounts = getTotalSwapped(data, supportedDenoms);
  const totalSwappedTotal = totalFromCoins(totalSwappedAmounts, fiatPrices, supportedDenoms);
  const strategiesCount = data.length;

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
      {!connected && chain === Chains.Kujira && (
        <Link href="/how-it-works">
          <Button w={44} variant="outline" colorScheme="blue">
            Learn how CALC works
          </Button>
        </Link>
      )}
      {!connected && chain === Chains.Osmosis && (
        <Link href="/create-strategy">
          <Button w={44} variant="outline" colorScheme="blue">
            Create a strategy
          </Button>
        </Link>
      )}
    </Stack>
  );
}

function WorkflowInformation() {
  return (
    <Center p={8}>
      <Flex direction="column">
        <Stack spacing={2} pb={8} textAlign="center" px={{ lg: 20 }}>
          <Heading size="md">Effortlessly invest in your favorite crypto assets from your savings.</Heading>
          <Text fontSize="md">Recurring payments means no stress. Set &amp; forget.</Text>
        </Stack>
        <Flex w="full" justifyContent="center">
          <Image src="/images/workflow.svg" />
        </Flex>
      </Flex>
    </Center>
  );
}

function Home() {
  const { connected } = useWallet();

  const { data } = useStrategies();
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];

  const { track } = useAnalytics();

  useEffect(() => {
    track('Home page viewed');
  }, []);

  return (
    <>
      <Box pb={8}>
        <Heading size="lg" mb={2}>
          Welcome to CALC, you&apos;ve made a great choice!
        </Heading>
        <Text textStyle="body">
          CALC removes the hardest part of investing, emotions! Stop being glued to a computer screen 24/7, define your
          strategy up front, and leave the rest to CALC.
        </Text>
      </Box>

      <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch">
        <TopPanel />
        {Boolean(activeStrategies.length) && (
          <GridItem colSpan={{ base: 6, lg: 2 }} h="full">
            <InvestmentThesis />
          </GridItem>
        )}

        <GridItem colSpan={{ base: 6 }}>{activeStrategies.length ? <WarningPanel /> : <InfoPanel />}</GridItem>
        {connected && (
          <GridItem colSpan={{ base: 6, lg: 6, xl: 3 }}>
            <ActiveStrategies />
          </GridItem>
        )}

        <GridItem colSpan={{ base: 6, xl: 3 }}>
          <TotalInvestment />
        </GridItem>
        <GridItem hidden={!!activeStrategies.length} colSpan={{ base: 6, xl: connected ? 6 : 3 }}>
          <WorkflowInformation />
        </GridItem>
      </Grid>
    </>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
