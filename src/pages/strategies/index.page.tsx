import { Box, Heading, Text, Stack, Flex } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@wizard-ui/react';
import { isStrategyCancelled, isStrategyCompleted, isStrategyOperating } from 'src/helpers/getStrategyStatus';
import useStrategies, { Strategy } from 'src/hooks/useStrategies';
import { getSidebarLayout } from '../../components/Layout';

function Page() {
  const { data, isLoading } = useStrategies();
  const { connected, connecting } = useWallet();

  const activeStrategies = data?.vaults.filter(isStrategyOperating).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];
  const completedStrategies =
    data?.vaults.filter(isStrategyCompleted).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const cancelledStrategies =
    data?.vaults.filter(isStrategyCancelled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  return (
    <>
      <Heading size="lg" pb={12}>
        My CALC Strategies
      </Heading>
      {!connected || connecting ? (
        <ConnectWallet layerStyle="panel" />
      ) : (
        <Stack spacing={8}>
          <Box>
            <Heading pb={2} size="md">
              Active Strategies ({activeStrategies.length})
            </Heading>
            <Text pb={4} textStyle="body">
              You can analyse the performance of or cancel these strategies at anytime.
            </Text>
            <Stack spacing={4}>
              {/* eslint-disable-next-line no-nested-ternary */}
              {!activeStrategies.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No active strategies</Text>}
                </Flex>
              ) : (
                activeStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
              )}
            </Stack>
          </Box>
          <Box>
            <Heading size="md" pb={2}>
              Completed Strategies ({completedStrategies.length})
            </Heading>
            <Text pb={4} textStyle="body">
              View your past performance.
            </Text>
            <Stack spacing={4}>
              {!completedStrategies.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No completed strategies</Text>}
                </Flex>
              ) : (
                completedStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
              )}
            </Stack>
          </Box>
          <Box>
            <Heading size="md" pb={2}>
              Cancelled Strategies ({cancelledStrategies.length})
            </Heading>
            <Text pb={4} textStyle="body">
              View cancelled strategies.
            </Text>
            <Stack spacing={4}>
              {!cancelledStrategies.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No completed strategies</Text>}
                </Flex>
              ) : (
                cancelledStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
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
