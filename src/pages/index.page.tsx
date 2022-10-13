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
} from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import { useWallet } from '@wizard-ui/react';
import Link from 'next/link';
import { getSidebarLayout } from '../components/Layout';
import TopPanel from '../components/TopPanel';

function InfoPanel() {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          <Text as="span" fontWeight="bold">
            Dollar-cost averaging
          </Text>{' '}
          is one of the easiest techniques to reduce the volatility risk of investing in crypto, and it&apos;s a great
          way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
  );
}

function WarningPanel() {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/warning.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          <Text as="span" fontWeight="bold">
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
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  const acculumatingAssets = Array.from(
    new Set(
      activeStrategies
        .filter((strategy) => strategy.configuration.position_type === 'enter')
        .map((strategy) => strategy.configuration.pair.base_denom),
    ),
  );

  const profitTakingAssets = Array.from(
    new Set(
      activeStrategies
        .filter((strategy) => strategy.configuration.position_type === 'exit')
        .map((strategy) => strategy.configuration.pair.quote_denom),
    ),
  );
  return (
    <Flex h={294} layerStyle="panel" p={8} alignItems="center">
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          <Heading size="md">My Investment Thesis:</Heading>
          <Heading size="xs">
            <HStack spacing={6}>
              <Text>Asset(s) accumulating:</Text>
              <HStack>
                {acculumatingAssets.length ? (
                  acculumatingAssets.map((asset) => <DenomIcon showTooltip key={asset} denomName={asset} />)
                ) : (
                  <Text>-</Text>
                )}
              </HStack>
            </HStack>
          </Heading>
          <Heading size="xs">
            <HStack spacing={6}>
              <Text>Asset(s) taking profit on:</Text>
              <HStack>
                {profitTakingAssets.length ? (
                  profitTakingAssets.map((asset) => <DenomIcon showTooltip denomName={asset} />)
                ) : (
                  <Text>-</Text>
                )}
              </HStack>
            </HStack>
          </Heading>
        </Stack>
      )}
    </Flex>
  );
}

function ActiveStrategies() {
  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  return (
    <Flex h={294} layerStyle="panel" p={8} alignItems="center">
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          <Heading size="md">My Active CALC Strategies</Heading>
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
                Review My Strategies
              </Button>
            </Link>
          )}
        </Stack>
      )}
    </Flex>
  );
}

function TotalInvestment() {
  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  const totalInvested = activeStrategies
    .map((strategy) => Number(strategy.balances[0].amount))
    .reduce((balance, acc) => acc + balance, 0);

  const formattedTotalInvested = totalInvested.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  return (
    <Flex h={294} layerStyle="panel" p={8} alignItems="center">
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          <Heading size="md">Total invested with CALC</Heading>
          <Stat>
            <StatLabel>Total capital invested</StatLabel>
            <StatNumber data-testid="total-invested">{formattedTotalInvested}</StatNumber>
          </Stat>
          <Divider />
          <HStack>
            <Box>
              <Heading size="xs">Fiat invested</Heading>
              <Text textStyle="body-xs">-</Text>
            </Box>
            <Box>
              <Heading size="xs">Stablecoin invested</Heading>
              <Text textStyle="body-xs">{formattedTotalInvested}</Text>
            </Box>
          </HStack>
        </Stack>
      )}
    </Flex>
  );
}

function WorkflowInformation() {
  return (
    <Center h={308}>
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
  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  return (
    <>
      <Box pb={6}>
        <Heading fontSize="3xl" mb={2}>
          Welcome to CALC, you&apos;ve made a great choice!
        </Heading>
        <Text fontSize="sm">
          CALC removes the hardest part of trading, emotions! Stop being glued to a computer screen 24/7, define your
          strategy up front, and leave the rest to CALC.
        </Text>
      </Box>
      <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="1fr">
        <GridItem colSpan={{ base: 6, lg: activeStrategies.length ? 4 : 6 }}>
          <TopPanel />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 2 }}>{Boolean(activeStrategies.length) && <InvestmentThesis />}</GridItem>

        <GridItem colSpan={{ base: 6 }}>{activeStrategies.length ? <WarningPanel /> : <InfoPanel />}</GridItem>
        {connected && (
          <GridItem colSpan={{ base: 6, lg: 3, xl: 2 }}>
            <ActiveStrategies />
          </GridItem>
        )}
        <GridItem
          colSpan={{ base: 6, xl: connected ? (activeStrategies.length ? 2 : 4) : 6 }}
          rowStart={activeStrategies.length ? { base: 4, xl: 3 } : undefined}
          colStart={activeStrategies.length ? { base: 0, xl: 3 } : undefined}
        >
          <WorkflowInformation />
        </GridItem>
        {Boolean(activeStrategies.length) && (
          <GridItem colSpan={{ base: 6, lg: 3, xl: 2 }}>
            <TotalInvestment />
          </GridItem>
        )}
      </Grid>
    </>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
