import { Button, Center, Flex, Heading, Link, Stack, Text, Image } from '@chakra-ui/react';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';

// eslint-disable-next-line react/function-component-definition
const CreateStrategy: NextPageWithLayout = () => (
  <Stack direction="column" spacing={10}>
    <Stack spacing={8}>
      <Heading>Set up an investment strategy</Heading>
      <Text>
        The first complete fiat-to-crypto decentralised DCA (dollar-cost averaging) protocol that provides advanced
        algorithms for long-term investing.
      </Text>
    </Stack>
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      w="full"
      h="sm"
      p={4}
      rounded={5}
      layerStyle="panel"
    >
      <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" w="full" h="full">
        <Heading>No Wallet connected</Heading>
        <Center>Get started by connecting your wallet.</Center>
        <Button>Connect to a wallet</Button>
        <Link href="/">Don’t have a wallet? Open one here</Link>
      </Stack>
    </Flex>
    <Stack rounded={5} direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="images/lightbulb.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          Dollar-cost averaging is one of the easiest techniques to reduce the volatility risk of investing in crypto,
          and it’s a great way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
  </Stack>
);

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
