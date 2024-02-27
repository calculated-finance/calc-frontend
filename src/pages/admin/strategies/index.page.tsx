import { Heading, Text, Flex, Center, Stack } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@hooks/useWallet';
import { isStrategyActive } from '@helpers/strategy';
import { Strategy } from '@models/Strategy';
import { getSidebarLayout } from '@components/Layout';
import ConnectWallet from '@components/ConnectWallet';
import { useAdmin } from '@hooks/useAdmin';
import { LockIcon } from '@chakra-ui/icons';
import {
  StrategyAccordionItem,
  StrategiesAccordionButton,
  StrategyAccordionPanel,
  StrategyAccordion,
} from '@components/StrategyAccordion';
import useAllStrategies from '@hooks/useAllStrategies';

function Page() {
  const { strategies, isLoading } = useAllStrategies();
  const { isAdmin } = useAdmin();
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectWallet layerStyle="panel" />;
  }

  if (!isAdmin) {
    return (
      <Center flexDirection="column" h="calc(100vh - 120px)">
        <LockIcon color="blue.200" boxSize={100} opacity="20%" m={5} />
        <Text fontSize="sm">Oops! Looks like you stumbled upon the forbidden land of admins.</Text>
      </Center>
    );
  }

  const activeStrategies = (strategies?.filter(isStrategyActive) ?? []).sort(
    (a: Strategy, b: Strategy) => Number(b.rawData.created_at) - Number(a.rawData.created_at),
  );

  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="lg">All Strategies</Heading>
        <Text color="red.200">Warning: these are all active users strategies!</Text>
      </Stack>

      <StrategyAccordion>
        <StrategyAccordionItem>
          <StrategiesAccordionButton>
            <Heading pb={2} size="md">
              Active Strategies ({activeStrategies.length})
            </Heading>
            <Text pb={2} textStyle="body">
              Strategies actively swapping.
            </Text>
          </StrategiesAccordionButton>
          <StrategyAccordionPanel>
            {/* eslint-disable-next-line no-nested-ternary */}
            {!activeStrategies.length ? (
              <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                {isLoading ? <Spinner /> : <Text>No active strategies</Text>}
              </Flex>
            ) : (
              activeStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
            )}
          </StrategyAccordionPanel>
        </StrategyAccordionItem>
      </StrategyAccordion>
    </Stack>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
