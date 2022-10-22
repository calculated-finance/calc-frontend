import {
  Badge,
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  useDisclosure,
  ButtonGroup,
  HStack,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ArrowRightIcon, CloseBoxedIcon } from '@fusion-icons/react/interface';
import { invalidateStrategies, Strategy } from '@hooks/useStrategies';
import Link from 'next/link';
import React from 'react';
import { getStrategyStartDate } from 'src/helpers/getStrategyStartDate';
import { getStrategyType } from 'src/helpers/getStrategyType';
import { getStrategyInitialDenom, getStrategyResultingDenom } from 'src/helpers/getInitialDenom';
import CancelStrategyModal from './CancelStrategyModal';
import DenomIcon from './DenomIcon';
import { StrategyStatusBadge } from './StrategyStatusBadge';
import { generateStrategyDetailUrl } from './TopPanel/generateStrategyDetailUrl';
import { generateStrategyTopUpUrl } from './TopPanel/generateStrategyTopUpUrl';

function CancelButton({ strategy }: { strategy: Strategy }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        colorScheme="red"
        leftIcon={<Icon as={CloseBoxedIcon} stroke="red.200" width={4} height={4} />}
        onClick={onOpen}
      >
        Cancel
      </Button>
      <CancelStrategyModal isOpen={isOpen} onClose={onClose} onCancel={invalidateStrategies} strategy={strategy} />
    </>
  );
}

function StrategyRow({ strategy }: { strategy: Strategy }) {
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  return (
    <Grid
      templateRows="repeat(1, 1fr)"
      templateColumns="repeat(15, 1fr)"
      gap={6}
      bg="gray.900"
      py={4}
      px={8}
      layerStyle="panel"
    >
      <GridItem colSpan={{ base: 8, xl: 3 }} rowStart={{ sm: 1, xl: 'auto' }}>
        <Heading size="md">{getStrategyType(strategy)}</Heading>
        <Text textStyle="body-xs">
          {' '}
          {getStrategyType(strategy)} {strategy.id}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: 4, xl: 2 }}>
        <Text fontSize="sm" pb={1}>
          Assets:
        </Text>
        <HStack spacing={1}>
          <DenomIcon showTooltip denomName={initialDenom} />
          <Icon as={ArrowRightIcon} stroke="grey" />
          <DenomIcon showTooltip denomName={resultingDenom} />
        </HStack>
      </GridItem>

      <GridItem colSpan={{ base: 4, xl: 2 }}>
        <Text fontSize="sm">Start Date:</Text>

        <Text textStyle="body-xs">{getStrategyStartDate(strategy)}</Text>
      </GridItem>

      <GridItem colSpan={{ base: 3, xl: 2 }}>
        <Text fontSize="sm">Status:</Text>
        <StrategyStatusBadge strategy={strategy} />
      </GridItem>

      <GridItem colSpan={{ base: 4, xl: 2 }}>
        <Text fontSize="sm">Cadence:</Text>
        <Text textStyle="body-xs" textTransform="capitalize">
          {strategy.time_interval}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: 7, xl: 1 }} rowStart={{ sm: 1, xl: 'auto' }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <ButtonGroup>
            <CancelButton strategy={strategy} />
            <Link href={generateStrategyTopUpUrl(strategy.id)}>
              <Button size="xs" variant="outline">
                Top up
              </Button>
            </Link>
          </ButtonGroup>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 15, xl: 3 }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <Link href={generateStrategyDetailUrl(strategy.id)}>
            <Button width={{ base: 'full', xl: 'initial' }}>View performance</Button>
          </Link>
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default StrategyRow;
