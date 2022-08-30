import { Badge, Box, Button, Divider, Grid, GridItem, Heading, Icon, Text, Image, Stack, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { FiTablet } from 'react-icons/fi';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';

function Strategy() {
  return (
    <Grid
      templateRows="repeat(1, 1fr)"
      templateColumns="repeat(19, 1fr)"
      gap={6}
      bg="gray.900"
      py={2}
      px={4}
      borderColor="gray.400"
      borderBottomWidth={1}
    >
      <GridItem colSpan={7}>
        <Stack direction="row" spacing={4} align="center" alignItems="center" h="full">
          <Image src="images/rebalance.svg" />
          <Heading size="md">Low Risk Blue Chips</Heading>
        </Stack>
      </GridItem>
      <GridItem colSpan={2}>
        <Text>ASSETS</Text>
        <Divider />
        <Icon as={FiTablet} />
        <Icon as={FiTablet} />
        <Icon as={FiTablet} />
        <Icon as={FiTablet} />
      </GridItem>

      <GridItem colSpan={2}>
        <Text>START DATE</Text>

        <Divider />
        <Text> Sept 22 2022</Text>
      </GridItem>

      <GridItem colSpan={2}>
        <Text>STATUS</Text>
        <Divider />
        <Badge colorScheme="green">Active</Badge>
      </GridItem>

      <GridItem colSpan={2}>
        <Text>CADENCE</Text>
        <Divider />
        <Text>Weekly</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Button variant="ghost" colorScheme="red">
          Cancel
        </Button>
      </GridItem>
      <GridItem colSpan={3}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <Link href="/strategies/1">
            <Button>View Performance</Button>
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
          {' '}
          Active Strategies (2)
        </Heading>
        <Text pb={4}>You can cancel these strategies at anytime. </Text>
        <Stack spacing={4}>
          <Strategy />
          <Strategy />
        </Stack>
      </Box>
      <Box>
        <Heading size="md" pb={2}>
          {' '}
          Completed Strategies (2)
        </Heading>
        <Text pb={4}>You can cancel these strategies at anytime. </Text>
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
