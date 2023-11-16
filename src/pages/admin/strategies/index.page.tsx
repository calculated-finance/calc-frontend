import { Heading, Text, Flex, Center, Stack } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@hooks/useWallet';
import { isStrategyActive, isStrategyCancelled, isStrategyCompleted, isStrategyScheduled } from '@helpers/strategy';
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
  const { data, isLoading } = useAllStrategies();
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

  const scheduledStrategies = data?.filter(isStrategyScheduled) ?? []; // .sort((a: Strategy, b: Strategy) => Number(b.id) - Number(a.id)) ?? [];
  const activeStrategies = data?.filter(isStrategyActive) ?? []; // .sort((a: Strategy, b: Strategy) => Number(b.id) - Number(a.id)) ?? [];
  const completedStrategies = data?.filter(isStrategyCompleted) ?? []; // .sort((a: Strategy, b: Strategy) => Number(b.id) - Number(a.id)) ?? [];
  const cancelledStrategies = data?.filter(isStrategyCancelled) ?? []; // .sort((a: Strategy, b: Strategy) => Number(b.id) - Number(a.id)) ?? [];

  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="lg">All Strategies</Heading>
        <Text color="red.200">Warning: these are all users strategies!</Text>
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

        {Boolean(scheduledStrategies.length) && (
          <StrategyAccordionItem>
            <StrategiesAccordionButton>
              <Heading pb={2} size="md">
                Scheduled Strategies ({scheduledStrategies.length})
              </Heading>
              <Text pb={2} textStyle="body">
                Strategies with triggers that are waiting to be executed.
              </Text>
            </StrategiesAccordionButton>
            <StrategyAccordionPanel>
              {/* eslint-disable-next-line no-nested-ternary */}
              {!scheduledStrategies.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No scheduled strategies</Text>}
                </Flex>
              ) : (
                scheduledStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
              )}
            </StrategyAccordionPanel>
          </StrategyAccordionItem>
        )}

        <StrategyAccordionItem>
          <StrategiesAccordionButton>
            <Heading size="md" pb={2}>
              Completed Strategies ({completedStrategies.length})
            </Heading>
            <Text pb={2} textStyle="body">
              Strategies that have fully executed their swaps. Top them up to reactivate them.
            </Text>
          </StrategiesAccordionButton>
          <StrategyAccordionPanel>
            {!completedStrategies.length ? (
              <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                {isLoading ? <Spinner /> : <Text>No completed strategies</Text>}
              </Flex>
            ) : (
              completedStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
            )}
          </StrategyAccordionPanel>
        </StrategyAccordionItem>

        <StrategyAccordionItem>
          <StrategiesAccordionButton>
            <Heading size="md" pb={2}>
              Cancelled Strategies ({cancelledStrategies.length})
            </Heading>
            <Text pb={2} textStyle="body">
              Strategies that have been closed, and the funds returned.
            </Text>
          </StrategiesAccordionButton>
          <StrategyAccordionPanel>
            {!cancelledStrategies.length ? (
              <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                {isLoading ? <Spinner /> : <Text>No cancelled strategies</Text>}
              </Flex>
            ) : (
              cancelledStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
            )}
          </StrategyAccordionPanel>
        </StrategyAccordionItem>
      </StrategyAccordion>
    </Stack>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
