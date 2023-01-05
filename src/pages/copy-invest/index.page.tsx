import { Box, Heading, Text, Stack, Flex } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import PortfolioRow from '@components/PortfolioRow';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@wizard-ui/react';
import {
  isStrategyActive,
  isStrategyCancelled,
  isStrategyCompleted,
  isStrategyScheduled,
} from 'src/helpers/getStrategyStatus';
import useStrategies, { Strategy } from 'src/hooks/useStrategies';
import { getSidebarLayout } from '../../components/Layout';

function Page() {
  const { data, isLoading } = useStrategies();
  const { connected, connecting } = useWallet();

  const scheduledStrategies =
    data?.vaults.filter(isStrategyScheduled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const activeStrategies = data?.vaults.filter(isStrategyActive).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];
  const completedStrategies =
    data?.vaults.filter(isStrategyCompleted).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const cancelledStrategies =
    data?.vaults.filter(isStrategyCancelled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  return (
    <>
      <Heading size="lg" pb={12}>
        View asset management strategies
      </Heading>
      {!connected || connecting ? (
        <ConnectWallet layerStyle="panel" />
      ) : (
        <Stack spacing={8}>
          <Box>
            <Heading pb={2} size="md">
              Copy track someone else’s basket of assets
            </Heading>
            <Text pb={4} textStyle="body">
              Select a basket below to start copying the allocation.
            </Text>
            <Stack spacing={4}>
              {/* eslint-disable-next-line no-nested-ternary */}
              <PortfolioRow />
              <PortfolioRow />
              <PortfolioRow />
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
