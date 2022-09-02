import { Button, Box, Heading, Text, Stack, Center, Image, Flex, Link, Grid, GridItem } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ArrowToprightIcon, BarChartIcon } from '@fusion-icons/react/interface';
import { getSidebarLayout } from '../components/Layout';
import { NextPageWithLayout } from './_app';

function Setup() {
  return (
    <Center rounded="2xl" borderWidth={2} borderColor="brand.200" h="full" minHeight={294} layerStyle="panel" p={8}>
      <Stack spacing={6}>
        <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
        <Stack spacing={2}>
          <Heading size="md">Ready to set up a CALC Strategy?</Heading>
          <Text fontSize="sm">
            Setting up a DCA strategy with CALC takes just 4 minutes. CALC, the ease of use offered by neobank apps
            combined with the power of DeFi.
          </Text>
        </Stack>
        <Button w="full" size="sm">
          Get Started
        </Button>
      </Stack>
    </Center>
  );
}

function FearAndGreed() {
  return (
    <Center rounded="2xl" layerStyle="panel" p={8} h={294}>
      <Stack spacing={2}>
        <Heading size="md">The Fear and Greed Index</Heading>
        <Text fontSize="xs">Multifactorial Crypto Market Sentiment Analysis</Text>
        <Text>
          <Text as="span">Now: </Text>
          <Text as="span" color="red.200">
            Extreme Fear
          </Text>
        </Text>
        <Box h="full" py={2}>
          <Box position="relative" height={16} overflow="hidden">
            <Box
              position="absolute"
              left="calc(50% - 68px)"
              width={32}
              height={32}
              borderRadius="50%"
              boxSizing="border-box"
              bgGradient="linear(to-l, #1AEFAF, #FFB636, #FF5858)"
            >
              <Box
                height="90%"
                width="90%"
                position="absolute"
                borderRadius="50%"
                background="deepHorizon"
                top="5%"
                left="5%"
              />
              <Center
                borderRadius="50%"
                bg="red.500"
                w={4}
                h={4}
                position="relative"
                fontSize="xx-small"
                left={3}
                top={3}
              >
                24
              </Center>
              <Icon
                as={ArrowToprightIcon}
                stroke="red.500"
                strokeWidth={1}
                width={16}
                height={16}
                position="relative"
                left="calc(50% - 48px)"
                transform="rotate(-90deg)"
              />
            </Box>
          </Box>
        </Box>
        <Link href="/" color="blue.200" fontSize="xs">
          Is now a good time to invest?
        </Link>
      </Stack>
    </Center>
  );
}

function LearnMore() {
  return (
    <Stack direction="row" rounded="2xl" layerStyle="panel" h="full" minHeight={294}>
      <Center roundedLeft="2xl" bg="black" h="full" flexShrink={0} w={157}>
        <Image src="images/layers.svg" w="200px" />
      </Center>
      <Center>
        <Stack spacing={6} p={8}>
          <Stack spacing={2}>
            <Heading size="md">How does CALC&apos;s DCA Strategy work?</Heading>
            <Text fontSize="sm">
              Find out what all the hype is about and why DCA&apos;ing into an on-chain product can provide you 10x the
              value you would get from a centralised exchange.
            </Text>
          </Stack>
          <Button variant="outline" colorScheme="blue">
            Read more
          </Button>
        </Stack>
      </Center>
    </Stack>
  );
}

function InfoPanel() {
  return (
    <Stack rounded="2xl" direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="images/iceblock.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          <Text as="span" color="blue.500">
            Dollar-cost averaging
          </Text>
          &nbsp;is one of the easiest techniques to reduce the volatility risk of investing in crypto, and it&apos;s a
          great way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
  );
}

function ActiveStrategies() {
  return (
    <Flex rounded="2xl" h={294} layerStyle="panel" p={8} alignItems="center">
      <Stack spacing={4}>
        <Heading size="md">My Active CALC Strategies</Heading>
        <Heading fontSize="5xl">0</Heading>
        <Button w={44} variant="outline" colorScheme="blue">
          Setup a strategy
        </Button>
      </Stack>
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
          <Image src="images/workflow.svg" />
        </Flex>
      </Flex>
    </Center>
  );
}

// eslint-disable-next-line react/function-component-definition
const Home: NextPageWithLayout = () => (
  <>
    <Box pb={6}>
      <Heading fontSize="3xl" mb={2}>
        Welcome to CALC, you&apos;ve made a great choice!
      </Heading>
      <Text fontSize="sm">
        CALC removes the hardest part of trading, emotion! Set &amp; forget, take back your time and forget about being
        gluded to a computer screen 24/7.
      </Text>
    </Box>
    <Grid gap={6} mb={6} templateColumns="repeat(5, 1fr)" templateRows="1fr">
      <GridItem colSpan={{ base: 5, xl: 2, '2xl': 2 }}>
        <Setup />
      </GridItem>
      <GridItem colSpan={{ base: 5, xl: 3, '2xl': 2 }}>
        <LearnMore />
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 2, '2xl': 1 }} rowStart={{ lg: 3, xl: 3, '2xl': 1 }} colStart={{ '2xl': 5 }}>
        <FearAndGreed />
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 5, '2xl': 5 }}>
        <InfoPanel />
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 3, '2xl': 2 }} rowStart={{ lg: 3, '2xl': 3 }} colStart={{ lg: 3, '2xl': 1 }}>
        <ActiveStrategies />
      </GridItem>
      <GridItem colSpan={{ base: 5, sm: 5, lg: 5, '2xl': 3 }}>
        <WorkflowInformation />
      </GridItem>
    </Grid>
  </>
);

Home.getLayout = getSidebarLayout;

export default Home;
