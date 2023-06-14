import { Heading, Text, Flex } from '@chakra-ui/react';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@hooks/useWallet';
import { isStrategyActive, isStrategyCancelled, isStrategyCompleted, isStrategyScheduled } from '@helpers/strategy';
import useStrategies, { Strategy } from 'src/hooks/useStrategies';
import { getSidebarLayout } from '@components/Layout';
import ConnectWallet from '@components/ConnectWallet';
import {
  StrategyAccordionItem,
  StrategiesAccordionButton,
  StrategyAccordionPanel,
  StrategyAccordion,
} from '@components/StrategyAccordion';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { Chains } from '@hooks/useChain/Chains';
import { useChain } from '@hooks/useChain';
import useStrategiesEVM from '@hooks/useStrategiesEVM';

function Page({strategies, isLoading}: {strategies: Strategy[] | undefined, isLoading: boolean}) {
  const { connected } = useWallet();

  // const scheduledStrategies =
  //   strategies?.filter(isStrategyScheduled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  // const activeStrategies = strategies?.filter(isStrategyActive).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];
  // const completedStrategies =
  //   strategies?.filter(isStrategyCompleted).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  // const cancelledStrategies =
  //   strategies?.filter(isStrategyCancelled).sort((a, b) => Number(b.id) - Number(a.id)) ?? [];

  const activeStrategies = strategies;
  const scheduledStrategies = [];
  const completedStrategies = [];
  const cancelledStrategies = [];


  return (
    <>
      <Heading size="lg" pb={12}>
        My CALC Strategies
      </Heading>

      {!connected ? (
        <ConnectWallet layerStyle="panel" />
      ) : (
        <StrategyAccordion>
          <StrategyAccordionItem>
            <StrategiesAccordionButton>
              <Heading pb={2} size="md">
                Active Strategies ({activeStrategies?.length})
              </Heading>
              <Text pb={2} textStyle="body">
                Strategies actively swapping.
              </Text>
            </StrategiesAccordionButton>
            <StrategyAccordionPanel>
              {/* eslint-disable-next-line no-nested-ternary */}
              {!activeStrategies?.length ? (
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
      )}
    </>
  );
}


function StrategiesCosmos() {
  const { data, isLoading } = useStrategies();
  return <Page strategies={data?.vaults} isLoading={isLoading} />;
}

function StrategiesEVM() {
  const { data: strategies, isLoading } = useStrategiesEVM();
  return <Page strategies={strategies} isLoading={isLoading} />;
}



function PageWrapper() {
  const { chain } = useChain();
  return chain === Chains.Moonbeam ? <StrategiesEVM  /> : <StrategiesCosmos />
}

PageWrapper.getLayout = getSidebarLayout;

export default PageWrapper;
