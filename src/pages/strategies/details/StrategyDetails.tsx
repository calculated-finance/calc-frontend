import { PlusSquareIcon } from '@chakra-ui/icons';
import { Heading, Grid, GridItem, Box, Text, Divider, Badge, Flex, Button } from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import Spinner from '@components/Spinner';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
import Link from 'next/link';
import { generateStrategyTopUpUrl } from '@components/TopPanel/generateStrategyTopUpUrl';
import { isStrategyCancelled } from 'src/helpers/getStrategyStatus';
import { getStrategyName } from 'src/helpers/getStrategyName';
import { getStrategyEndDate } from 'src/helpers/getStrategyEndDate';
import { Strategy } from '@hooks/useStrategies';
import { useWallet } from '@wizard-ui/react';
import useValidator from '@hooks/useValidator';
import { getStrategyInitialDenom } from 'src/helpers/getStrategyInitialDenom';
import { getStrategyResultingDenom } from 'src/helpers/getStrategyResultingDenom';
import { getStrategyStartDate } from 'src/helpers/getStrategyStartDate';
import { getStrategyType } from 'src/helpers/getStrategyType';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { CancelButton } from './CancelButton';
import { StrategyStatusBadge } from '../../../components/StrategyStatusBadge';

export default function StrategyDetails({ strategy }: { strategy: Strategy }) {
  const { address } = useWallet();
  const { validator, isLoading } = useValidator(strategy.destinations[0].address);

  const { time_interval, swap_amount, balance, destinations } = strategy;
  const initialDenom = getStrategyInitialDenom(strategy);

  const initialDenomValue = new DenomValue(balance);
  const swapAmountValue = new DenomValue({ denom: initialDenom, amount: swap_amount });

  const strategyType = getStrategyType(strategy);

  const startDate = getStrategyStartDate(strategy);

  const { data: eventsData } = useStrategyEvents(strategy.id);
  const events = eventsData?.events;

  return (
    <GridItem colSpan={[6, null, null, null, 3]}>
      <Heading pb={4} size="md">
        Strategy details
      </Heading>
      <Box px={8} py={6} layerStyle="panel">
        <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center">
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy status</Heading>
          </GridItem>
          <GridItem colSpan={1} data-testid="strategy-status">
            <StrategyStatusBadge strategy={strategy} />
          </GridItem>
          <GridItem colSpan={1} visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}>
            <Flex justifyContent="end">
              <CancelButton strategy={strategy} />
            </Flex>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy name</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-name">
              {getStrategyName(strategy)}
            </Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Divider />
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy type</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-type">
              {strategyType}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Strategy start date</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-start-date">
              {startDate}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Estimated strategy end date</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="estimated-strategy-end-date">
              {getStrategyEndDate(strategy, events)}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Investment cycle</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" textTransform="capitalize" data-testid="strategy-investment-cycle">
              {time_interval}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Purchase each cycle</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-swap-amount">
              {swapAmountValue.toConverted()} {getDenomInfo(initialDenom).name}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Current amount in vault</Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontSize="sm" data-testid="strategy-current-balance">
              {initialDenomValue.toConverted()} {getDenomInfo(initialDenom).name}
            </Text>
          </GridItem>
          <GridItem visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}>
            <Flex justify="end">
              <Link href={generateStrategyTopUpUrl(strategy.id)}>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="brand"
                  leftIcon={<CalcIcon as={PlusSquareIcon} stroke="brand.200" width={4} height={4} />}
                >
                  Add more funds
                </Button>
              </Link>
            </Flex>
          </GridItem>
          {Boolean(destinations.length) &&
            (destinations[0].address.startsWith('kujiravaloper') ? (
              <>
                <GridItem colSpan={1}>
                  <Heading size="xs">Auto staking status</Heading>
                </GridItem>
                <GridItem colSpan={2} data-testid="strategy-auto-staking-status">
                  <Badge colorScheme="green">Active</Badge>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Validator name</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm" data-testid="strategy-validator-name">
                    {isLoading ? <Spinner /> : validator?.description?.moniker}
                  </Text>
                </GridItem>
              </>
            ) : (
              destinations[0].address !== address && (
                <>
                  <GridItem colSpan={1}>
                    <Heading size="xs">Sending to </Heading>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text fontSize="sm" data-testid="strategy-receiving-address">
                      {destinations[0].address}
                    </Text>
                  </GridItem>
                </>
              )
            ))}
        </Grid>
      </Box>
    </GridItem>
  );
}
