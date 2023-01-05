import { Button, Grid, GridItem, Heading, Text, Flex, useDisclosure, ButtonGroup, HStack } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ArrowRightIcon, CloseBoxedIcon } from '@fusion-icons/react/interface';
import { invalidateStrategies, Strategy } from '@hooks/useStrategies';
import Link from 'next/link';
import { getStrategyType } from 'src/helpers/getStrategyType';
import { getStrategyResultingDenom } from 'src/helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import { isStrategyCancelled } from 'src/helpers/getStrategyStatus';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { getStrategyName } from 'src/helpers/getStrategyName';
import getDenomInfo from '@utils/getDenomInfo';
import { TestnetDenoms } from '@models/Denom';
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

function PortfolioRow() {
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
        <Heading size="md">Name</Heading>
        <Text textStyle="body-xs"> kujira...zm49mt</Text>
      </GridItem>
      <GridItem colSpan={{ base: 4, xl: 2 }}>
        <Text fontSize="sm" pb={1}>
          Assets:
        </Text>
        <HStack spacing={1}>
          <DenomIcon showTooltip denomName={TestnetDenoms.Kuji} />
          <DenomIcon showTooltip denomName={TestnetDenoms.LUNA} />
        </HStack>
      </GridItem>
      <GridItem colSpan={{ base: 3, xl: 2 }}>
        <Text fontSize="sm">AUM:</Text>
        <Text textStyle="body-xs">$1,928,342.23</Text>
      </GridItem>
      <GridItem colSpan={{ base: 3, xl: 2 }}>
        <Text fontSize="sm">Depositors:</Text>
        <Text textStyle="body-xs">112</Text>
      </GridItem>
      <GridItem colSpan={{ base: 3, xl: 1 }}>
        <Text fontSize="sm">30 Days:</Text>
        <Text textStyle="body-xs" color="green.200">
          1.46%
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: 3, xl: 1 }}>
        <Text fontSize="sm">24 hours:</Text>
        <Text textStyle="body-xs" color="red.200">
          -2.56%
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 15, xl: 4 }}>
        <Flex justifyContent="end" alignItems="center" h="full">
          <ButtonGroup>
            <Button variant="outline" width={{ base: 'full', xl: 'initial' }}>
              More details
            </Button>
            <Button width={{ base: 'full', xl: 'initial' }}>View performance</Button>
          </ButtonGroup>
        </Flex>
      </GridItem>
      {/* 

     
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
      */}
    </Grid>
  );
}

export default PortfolioRow;
