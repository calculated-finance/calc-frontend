import { Button, Grid, GridItem, Heading, Text, Flex, useDisclosure, ButtonGroup, HStack } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ArrowRightIcon, CloseBoxedIcon } from '@fusion-icons/react/interface';
import { invalidateStrategies, Strategy } from '@hooks/useStrategies';
import Link from 'next/link';

import getDenomInfo from '@utils/getDenomInfo';
import { executionIntervalLabel } from '@helpers/executionIntervalDisplay';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyType,
  getStrategyName,
  isStrategyCancelled,
} from '@helpers/strategy';
import { PlusSquareIcon } from '@chakra-ui/icons';
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
        <Text textStyle="body-xs"> {getStrategyName(strategy)}</Text>
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

      <GridItem colSpan={{ base: 3, xl: 2 }}>
        <Text fontSize="sm">Status:</Text>
        <StrategyStatusBadge strategy={strategy} />
      </GridItem>

      <GridItem colSpan={{ base: 4, xl: 2 }}>
        <Text fontSize="sm">Interval:</Text>
        <Text textStyle="body-xs">
          <Text as="span">{executionIntervalLabel[strategy.time_interval]}</Text>:{' '}
          {Number(getDenomInfo(initialDenom).conversion(Number(strategy.swap_amount)).toFixed(6))}{' '}
          {getDenomInfo(initialDenom).name}
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 4, xl: 2 }}>
        <Text fontSize="sm">Balance:</Text>
        <Text textStyle="body-xs">
          {Number(getDenomInfo(strategy.balance.denom).conversion(Number(strategy.balance.amount)).toFixed(6))}{' '}
          {getDenomInfo(strategy.balance.denom).name}
        </Text>
      </GridItem>
      <GridItem
        visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}
        colSpan={{ base: 7, xl: 1 }}
        rowStart={{ sm: 1, xl: 'auto' }}
      >
        <Flex justifyContent="end" alignItems="center" h="full">
          <ButtonGroup>
            <Link href={generateStrategyTopUpUrl(strategy.id)}>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Icon as={PlusSquareIcon} stroke="brand.200" width={4} height={4} />}
              >
                Top up
              </Button>
            </Link>
            <CancelButton strategy={strategy} />
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
