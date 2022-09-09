import { Box, Heading, Text, Stack, Flex } from '@chakra-ui/react';
import Strategy from '@components/Strategy';
import useStrategies from 'src/hooks/useStrategies';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';

// eslint-disable-next-line react/function-component-definition
const Strategies: NextPageWithLayout = () => {
  const { data, isLoading } = useStrategies();

  return (
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
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
              <Text>Loading...</Text>
            ) : data.vaults?.length === 0 ? (
              <Stack spacing={4}>
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel" borderRadius="2xl">
                  <Text>No active strategies</Text>
                </Flex>
              </Stack>
            ) : (
              data.vaults?.map((strategy: any) => <Strategy key={strategy.id} strategy={strategy} />)
            )}
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
            <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel" borderRadius="2xl">
              <Text>No completed strategies</Text>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

Strategies.getLayout = getSidebarLayout;

export default Strategies;
