import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import StrategyRow from '@components/StrategyRow';
import { useWallet } from '@wizard-ui/react';
import { isStrategyActive, isStrategyCancelled, isStrategyCompleted, isStrategyScheduled } from '@helpers/strategy';
import useStrategies, { Strategy } from 'src/hooks/useStrategies';
import { getSidebarLayout } from '@components/Layout';
import { ChildrenProp } from 'src/helpers/ChildrenProp';

function StrategiesAccordionButton({ children }: ChildrenProp) {
  return (
    <AccordionButton borderRadius="2xl" p={0} role="group" _hover={{ background: 'none' }}>
      <Box as="span" flex="1" textAlign="left">
        {children}
      </Box>
      <Box
        _groupHover={{ background: 'blue.200' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={1}
        borderRadius="50%"
        marginRight={2}
      >
        <AccordionIcon _groupHover={{ color: 'abyss.200' }} />
      </Box>
    </AccordionButton>
  );
}

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
        My CALC Strategies
      </Heading>

      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem border="none" margin={0}>
          <StrategiesAccordionButton>
            <Heading pb={2} size="md">
              Active Strategies ({activeStrategies.length})
            </Heading>
            <Text pb={2} textStyle="body">
              Strategies actively swapping.
            </Text>
          </StrategiesAccordionButton>
          <AccordionPanel pb={8}>
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
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Stack spacing={8}>
        {Boolean(scheduledStrategies.length) && (
          <Accordion allowToggle>
            <AccordionItem border="none">
              <StrategiesAccordionButton>
                <Heading pb={2} size="md">
                  Scheduled Strategies ({scheduledStrategies.length})
                </Heading>
                <Text pb={2} textStyle="body">
                  Strategies with triggers that are waiting to be executed.
                </Text>
              </StrategiesAccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {!scheduledStrategies.length ? (
                    <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                      {isLoading ? <Spinner /> : <Text>No scheduled strategies</Text>}
                    </Flex>
                  ) : (
                    scheduledStrategies.map((strategy: Strategy) => (
                      <StrategyRow key={strategy.id} strategy={strategy} />
                    ))
                  )}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </Stack>

      <Accordion allowToggle>
        <AccordionItem border="none">
          <StrategiesAccordionButton>
            <Heading size="md" pb={2}>
              Completed Strategies ({completedStrategies.length})
            </Heading>
            <Text pb={2} textStyle="body">
              Strategies that have fully executed their swaps. Top them up to reactivate them.
            </Text>
          </StrategiesAccordionButton>
          <AccordionPanel pb={4}>
            <Stack spacing={4}>
              {!completedStrategies.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No completed strategies</Text>}
                </Flex>
              ) : (
                completedStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
              )}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Accordion allowToggle>
        <AccordionItem border="none">
          <StrategiesAccordionButton>
            <Heading size="md" pb={2}>
              Cancelled Strategies ({cancelledStrategies.length})
            </Heading>
            <Text pb={2} textStyle="body">
              Strategies that have been closed, and the funds returned.
            </Text>
          </StrategiesAccordionButton>
          <AccordionPanel pb={4}>
            <Stack spacing={4}>
              {!cancelledStrategies.length ? (
                <Flex bg="gray.900" justifyContent="center" py={8} px={4} layerStyle="panel">
                  {isLoading ? <Spinner /> : <Text>No cancelled strategies</Text>}
                </Flex>
              ) : (
                cancelledStrategies.map((strategy: Strategy) => <StrategyRow key={strategy.id} strategy={strategy} />)
              )}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
