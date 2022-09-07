import { Badge, Box, Button, Grid, GridItem, Heading, Text, Image, Stack, Flex } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { CloseBoxedIcon } from '@fusion-icons/react/interface';
import { useWallet } from '@wizard-ui/react';
import Link from 'next/link';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';

function Strategy() {
  return (
    <Grid
      templateRows="repeat(1, 1fr)"
      templateColumns="repeat(15, 1fr)"
      gap={6}
      bg="gray.900"
      py={2}
      px={4}
      layerStyle="panel"
      borderRadius="2xl"
    >
      <GridItem colSpan={{ base: 11, lg: 3 }} rowStart={{ sm: 1, lg: 'auto' }}>
        <Heading size="md">Rebalance</Heading>
        <Text textStyle="body-xs">Low Risk Blue Chips</Text>
      </GridItem>
      <GridItem colSpan={{ base: 4, lg: 2 }}>
        <Text>Asset(s):</Text>
        <Image w={5} src="/images/kujira.svg" />
      </GridItem>

      <GridItem colSpan={{ base: 4, lg: 2 }}>
        <Text>Start date:</Text>

        <Text textStyle="body-xs">Sept 22 2022</Text>
      </GridItem>

      <GridItem colSpan={{ base: 3, lg: 2 }}>
        <Text>Status:</Text>
        <Badge fontSize="10px" colorScheme="green">
          Active
        </Badge>
      </GridItem>

      <GridItem colSpan={{ base: 4, lg: 2 }}>
        <Text>Cadence:</Text>
        <Text textStyle="body-xs">Weekly</Text>
      </GridItem>
      <GridItem colSpan={{ base: 4, lg: 1 }} rowStart={{ sm: 1, lg: 'auto' }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <Button
            variant="ghost"
            colorScheme="red"
            width={{ base: 'full', lg: 'initial' }}
            leftIcon={<Icon as={CloseBoxedIcon} stroke="red.200" width={4} height={4} />}
          >
            Cancel
          </Button>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 15, lg: 3 }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <Link href="/strategies/1">
            <Button width={{ base: 'full', lg: 'initial' }}>View Performance</Button>
          </Link>
        </Flex>
      </GridItem>
    </Grid>
  );
}

// eslint-disable-next-line react/function-component-definition
const Strategies: NextPageWithLayout = () => (
  <>
    <Heading pb={12}>My CALC Strategies</Heading>
    <Stack spacing={8}>
      <Box>
        <Heading pb={2} size="md">
          Active Strategies (2)
        </Heading>
        <Text pb={4} textStyle="body">
          You can analyse the performance of or cancel these strategies at anytime.
        </Text>
        <Stack spacing={4}>
          <Strategy />
          <Strategy />
        </Stack>
      </Box>
      <Box>
        <Heading size="md" pb={2}>
          Completed Strategies (2)
        </Heading>
        <Text pb={4} textStyle="body">
          View your past performance.
        </Text>
        <Stack spacing={4}>
          <Strategy />
          <Strategy />
        </Stack>
      </Box>
    </Stack>
  </>
);

Strategies.getLayout = getSidebarLayout;

export default Strategies;
