import { Badge, Button, Grid, GridItem, Heading, Text, Flex, useDisclosure, ButtonGroup } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { CloseBoxedIcon } from '@fusion-icons/react/interface';
import { Strategy } from '@hooks/useStrategies';
import Link from 'next/link';
import React from 'react';
import CancelStrategyModal from './CancelStrategyModal';
import DenomIcon from './DenomIcon';

function CancelButton({ strategy }: { strategy: Strategy }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        colorScheme="red"
        width={{ base: 'full', lg: 'initial' }}
        leftIcon={<Icon as={CloseBoxedIcon} stroke="red.200" width={4} height={4} />}
        onClick={onOpen}
      >
        Cancel
      </Button>
      <CancelStrategyModal isOpen={isOpen} onClose={onClose} strategy={strategy} />
    </>
  );
}

function StrategyRow({ strategy }: { strategy: Strategy }) {
  return (
    <Grid
      templateRows="repeat(1, 1fr)"
      templateColumns="repeat(15, 1fr)"
      gap={6}
      bg="gray.900"
      py={2}
      px={4}
      layerStyle="panel"
    >
      <GridItem colSpan={{ base: 11, lg: 3 }} rowStart={{ sm: 1, lg: 'auto' }}>
        <Heading size="md">DCA</Heading>
        <Text textStyle="body-xs">DCA In ({strategy.id})</Text>
      </GridItem>
      <GridItem colSpan={{ base: 4, lg: 2 }}>
        <Text>Asset(s):</Text>
        <DenomIcon denomName={strategy.configuration.pair.base_denom} />
      </GridItem>

      <GridItem colSpan={{ base: 4, lg: 2 }}>
        <Text>Start date:</Text>

        <Text textStyle="body-xs">
          {/* {new Date(strategy.tracking_information.target_execution_time).toLocaleDateString()} */}
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 3, lg: 2 }}>
        <Text>Status:</Text>
        <Badge fontSize="10px" colorScheme="green">
          Active
        </Badge>
      </GridItem>

      <GridItem colSpan={{ base: 4, lg: 2 }}>
        <Text>Cadence:</Text>
        <Text textStyle="body-xs" textTransform="capitalize">
          {/* {strategy.execution_interval} */}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: 4, lg: 1 }} rowStart={{ sm: 1, lg: 'auto' }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <ButtonGroup>
            <CancelButton strategy={strategy} />
            <Link href={`/strategies/${strategy.id}/top-up`}>
              <Button size="xs" variant="outline">
                Top up
              </Button>
            </Link>
          </ButtonGroup>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 15, lg: 3 }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <Link href={`/strategies/${strategy.id}`}>
            <Button width={{ base: 'full', lg: 'initial' }}>View performance</Button>
          </Link>
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default StrategyRow;
