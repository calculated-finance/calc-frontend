import { Button, Flex, Grid, GridItem, Heading, Link, Stack, Text, Image, Spacer } from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';
import ProStrategyNotificationCard from '@components/ProStrategyNotificationCard';

function InfoPanel(): JSX.Element {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4} paddingLeft={6}>
      <Text fontSize={30}>👀</Text>
      <Flex alignItems="center">
        <Text textStyle="body">Pro Strategies are coming soon with first access going to whitelisted members.</Text>
      </Flex>
    </Stack>
  );
}

export function ProStrategies() {
  return (
    <Stack spacing="1.3rem">
      <Heading size="lg">Pro Strategies Minus The Complexity.</Heading>
      <Heading size="md">Bot and Trading Strategies</Heading>
      <Grid gap={8} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch" pb={6}>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          <ProStrategyNotificationCard
            title={'ETH/BTC Pair Trading'}
            description={
              'Stay exposed to the ETH and BTC market while profiting by capturing fluctuations in price relative to each other.'
            }
            link={''}
            backgroundImage={'/images/prostrategy1.svg'}
          />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          <ProStrategyNotificationCard
            title={'Mean Reversion Trading'}
            description={
              'Profit after an extreme price move, if an assets price tends back to normal or average levels.'
            }
            link={''}
            backgroundImage={'/images/prostrategy2.svg'}
          />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          <ProStrategyNotificationCard
            title={'Stoikov Market-Making'}
            description={
              'Run your own market-making trading strategy that seeks to profit by providing liquidity to other traders.'
            }
            link={''}
            backgroundImage={'/images/prostrategy3.svg'}
          />
        </GridItem>
      </Grid>
      <Spacer></Spacer>
      <InfoPanel />
    </Stack>
  );
}

ProStrategies.getLayout = getSidebarLayout;

export default ProStrategies;
