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
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  Wrap,
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import useStrategies from '@hooks/useStrategies';
import { useWallet } from '@wizard-ui/react';
import Link from 'next/link';
import { isStrategyOperating } from 'src/helpers/getStrategyStatus';
import { getSidebarLayout } from '../components/Layout';
import TopPanel from '../components/TopPanel';

function InfoPanel() {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text textStyle="body">
          Dollar-cost averaging is one of the easiest techniques to reduce the volatility risk of investing in crypto,
          and it&apos;s a great way to practice buy-and-hold investing over a few cycles.
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

function InvestmentThesis() {
  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
  const acculumatingAssets = Array.from(
    new Set(
      activeStrategies
        .filter((strategy) => strategy.position_type === 'enter')
        .map((strategy) => strategy.pair.base_denom),
    ),
  );

  const profitTakingAssets = Array.from(
    new Set(
      activeStrategies
        .filter((strategy) => strategy.position_type === 'exit')
        .map((strategy) => strategy.pair.base_denom),
    ),
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
                  profitTakingAssets.map((asset) => <DenomIcon size={6} showTooltip denomName={asset} />)
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
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          <Heading size="md">My active CALC strategies</Heading>
          <Heading data-testid="active-strategy-count" fontSize="5xl">
            {activeStrategies.length}
          </Heading>
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
      )}
    </Flex>
  );
}

function TotalInvestment() {
  return (
    <Flex layerStyle="panel" p={8} alignItems="center" h="full">
      <Stack spacing={4}>
        <Heading size="md">Total invested with CALC</Heading>
        <Stat>
          <StatLabel>Total capital invested</StatLabel>
          <StatNumber data-testid="total-invested">(Coming Soon)</StatNumber>
        </Stat>
        <Divider />
        <HStack>
          <Box>
            <Heading size="xs">Fiat invested</Heading>
            <Text textStyle="body-xs">-</Text>
          </Box>
          <Box>
            <Heading size="xs">Stablecoin invested</Heading>
            <Text textStyle="body-xs">(Coming Soon)</Text>
          </Box>
        </HStack>
      </Stack>
    </Flex>
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
  return (
    <>
      <Box pb={8}>
        <Heading size="lg" mb={2}>
          Welcome to CALC, you&apos;ve made a great choice!
        </Heading>
        <Text textStyle="body">
          CALC removes the hardest part of trading, emotions! Stop being glued to a computer screen 24/7, define your
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
          <GridItem colSpan={{ base: 6, lg: activeStrategies.length ? 3 : 6, xl: 3 }}>
            <ActiveStrategies />
          </GridItem>
        )}
        <GridItem hidden={!!activeStrategies.length} colSpan={{ base: 6, xl: connected ? 3 : 6 }}>
          <WorkflowInformation />
        </GridItem>
        {Boolean(activeStrategies.length) && (
          <GridItem colSpan={{ base: 6, lg: 3 }}>
            <TotalInvestment />
          </GridItem>
        )}
      </Grid>
    </>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
