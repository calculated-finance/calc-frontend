import {
  Button,
  Box,
  Heading,
  Text,
  Stack,
  Center,
  ButtonGroup,
  Wrap,
  WrapItem,
  Image,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { getSidebarLayout } from '../components/Layout';
import { NextPageWithLayout } from './_app';

// eslint-disable-next-line react/function-component-definition
const Home: NextPageWithLayout = () => (
  <Stack spacing={12} direction="column">
    <Box>
      <Heading fontSize="4xl" pb={4}>
        👋 Welcome to CALC, you&apos;ve made a great choice!
      </Heading>
      <Text fontSize="sm">
        CALC removes the hardest part of trading, emotion! Set &amp; forget, take back your time and forget about being
        gluded to a computer screen 24/7.
      </Text>
    </Box>
    <Wrap spacing={8}>
      <WrapItem rounded={5} w="md" layerStyle="panel" p={4}>
        <Stack spacing={4}>
          <Heading size="md">Set up your DCA Strategy Now</Heading>
          <Text fontSize="sm">
            Setting up a DCA strategy with CALC takes just 4 minutes. CALC, the ease of use offered by neobank apps
            combined with the power of DeFi.
          </Text>
          <Button w="full">Get Started</Button>
        </Stack>
      </WrapItem>
      <WrapItem rounded={5} w="xs" layerStyle="panel" p={4}>
        <Stack spacing={4} w="full">
          <Heading size="md" textAlign="center">
            Fear &amp; Greed Index
          </Heading>
          <Divider />
          <Center>
            <Heading size="md" textAlign="center">
              200 USK
            </Heading>
          </Center>
          <ButtonGroup justifyContent="center" w="full">
            <Button>Get Started</Button>
            <Button variant="ghost">Learn more</Button>
          </ButtonGroup>
        </Stack>
      </WrapItem>
      <WrapItem rounded={5} w="xl" layerStyle="panel" h="min-content">
        <Stack direction="row" spacing={4}>
          <Box roundedLeft={5} p={2} bg="black">
            <Image src="images/layers.svg" />
          </Box>
          <Stack spacing={4} p={4}>
            <Heading size="md">How does CALC&apos;s DCA Strategy work?</Heading>
            <Text fontSize="sm">Quickly learn the power CALC provides you.</Text>
            <Button variant="outline" colorScheme="blue">
              Read more
            </Button>
          </Stack>
        </Stack>
      </WrapItem>
    </Wrap>
    <Stack rounded={5} direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="images/lightbulb.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          Dollar-cost averaging is one of the easiest techniques to reduce the volatility risk of investing in crypto,
          and it&apos;s a great way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
    <Wrap spacing={8}>
      <WrapItem rounded={5} w="md" layerStyle="panel" p={4}>
        <Stack spacing={4}>
          <Heading size="md">My Active CALC Strategies</Heading>
          <Heading>0</Heading>
          <Button variant="outline" colorScheme="blue">
            Setup a strategy
          </Button>
        </Stack>
      </WrapItem>
      <WrapItem rounded={5} w="3xl" layerStyle="panel">
        <Flex direction="column" w="full">
          <Box p={4}>
            <Heading size="md">Effortlessly invest in your favorite crypto assets from your savings.</Heading>
            <Text fontSize="sm">Recurring payments means no stress. Set &amp; forget.</Text>
          </Box>
          <Flex p={4} w="full" justifyContent="center">
            <Image src="images/workflow.svg" />
          </Flex>
        </Flex>
      </WrapItem>
    </Wrap>
  </Stack>
);

Home.getLayout = getSidebarLayout;

export default Home;
