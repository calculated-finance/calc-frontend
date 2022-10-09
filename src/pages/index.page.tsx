import { Button, Box, Heading, Text, Stack, Center, Image, Flex, Link, Grid, GridItem } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import { useWallet } from '@wizard-ui/react';
import { getSidebarLayout } from '../components/Layout';
import TopPanel from '../components/TopPanel';

function InfoPanel() {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          <Text as="span" color="blue.500">
            Dollar-cost averaging
          </Text>{' '}
          is one of the easiest techniques to reduce the volatility risk of investing in crypto, and it&apos;s a great
          way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
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
          <Button w={44} variant="outline" colorScheme="blue">
            Setup a strategy
          </Button>
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
      <Grid gap={6} mb={6} templateColumns="repeat(5, 1fr)" templateRows="1fr">
        <TopPanel />
        <GridItem colSpan={{ base: 5, lg: 5, '2xl': 5 }}>
          <InfoPanel />
        </GridItem>
        {connected && (
          <GridItem colSpan={{ base: 5, lg: 3, '2xl': 2 }}>
            <ActiveStrategies />
          </GridItem>
        )}
        <GridItem colSpan={{ base: 5, sm: 5, lg: 5, '2xl': 3 }}>
          <WorkflowInformation />
        </GridItem>
      </Grid>
    </>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
