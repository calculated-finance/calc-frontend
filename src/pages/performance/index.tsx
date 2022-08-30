import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';

// eslint-disable-next-line react/function-component-definition
const Performance: NextPageWithLayout = () => (
  <Stack direction="column" spacing={10}>
    <Stack spacing={8}>
      <Heading>Set up an investment strategy</Heading>
      <Text>
        The first full fiat-to-crypto decentralised dollar-cost averaging protocol that provides advanced algorithms for
        long-term investing and customisable tools to remove the emotion from trading.
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
    />
  </Stack>
);

Performance.getLayout = getSidebarLayout;

export default Performance;
