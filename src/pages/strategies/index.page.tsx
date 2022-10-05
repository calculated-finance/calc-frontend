import { Box, Heading, Text, Stack, Flex } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@wizard-ui/react';
import useStrategies, { Strategy, useCompletedStrategies } from 'src/hooks/useStrategies';
import { getSidebarLayout } from '../../components/Layout';

function Page() {
  const { data, isLoading } = useStrategies();
  const { data: completedData, isLoading: completedIsLoading } = useCompletedStrategies();
  const { connected, connecting } = useWallet();

  console.log(data);

  return (
    <>
      <Heading pb={12}>My CALC Strategies</Heading>
      {!connected || connecting ? (
        <ConnectWallet layerStyle="panel" />
      ) : (
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
              {!data?.vaults?.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No active strategies</Text>}
                </Flex>
              ) : (
                data?.vaults?.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
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
              {!completedData?.vaults?.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {completedIsLoading ? <Spinner /> : <Text>No active strategies</Text>}
                </Flex>
              ) : (
                completedData?.vaults?.map((strategy: Strategy) => (
                  <StrategyRow key={strategy.id} strategy={strategy} />
                ))
              )}
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
