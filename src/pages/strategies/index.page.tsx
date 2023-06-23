import { Heading, Text, Flex } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import { isStrategyActive, isStrategyCancelled, isStrategyCompleted, isStrategyScheduled } from '@helpers/strategy';
import { getSidebarLayout } from '@components/Layout';
import ConnectWallet from '@components/ConnectWallet';
import {
  StrategyAccordionItem,
  StrategiesAccordionButton,
  StrategyAccordionPanel,
  StrategyAccordion,
} from '@components/StrategyAccordion';
import { useStrategies } from '@hooks/useStrategies';
import { StrategyList } from './StrategyList';

function StrategyAccordians() {
  const { data: strategies, isLoading } = useStrategies();
  const scheduledStrategies = strategies?.filter(isStrategyScheduled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const activeStrategies = strategies?.filter(isStrategyActive).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];
  const completedStrategies = strategies?.filter(isStrategyCompleted).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const cancelledStrategies = strategies?.filter(isStrategyCancelled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  return (
    <StrategyAccordion>
      <StrategyAccordionItem>
        <StrategiesAccordionButton>
          <Heading pb={2} size="md">
            Active Strategies ({activeStrategies?.length || 0})
          </Heading>
          <Text pb={2} textStyle="body">
            Strategies actively swapping.
          </Text>
        </StrategiesAccordionButton>
        <StrategyAccordionPanel>
          {!activeStrategies?.length ? (
            <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
              {isLoading ? <Spinner /> : <Text>No active strategies</Text>}
            </Flex>
          ) : (
            <StrategyList strategies={activeStrategies} />
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
            {!scheduledStrategies.length ? (
              <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                {isLoading ? <Spinner /> : <Text>No scheduled strategies</Text>}
              </Flex>
            ) : (
              <StrategyList strategies={scheduledStrategies} />
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
            <StrategyList strategies={completedStrategies} />
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
            <StrategyList strategies={cancelledStrategies} />
          )}
        </StrategyAccordionPanel>
      </StrategyAccordionItem>
    </StrategyAccordion>
  );
}

function Page() {
  const { connected } = useWallet();

  return (
    <>
      <Heading size="lg" pb={12}>
        My CALC Strategies
      </Heading>

      {!connected ? <ConnectWallet layerStyle="panel" /> : <StrategyAccordians />}
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
