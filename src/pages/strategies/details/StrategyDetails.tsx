import { ExternalLinkIcon, PlusSquareIcon } from '@chakra-ui/icons';
import {
  Heading,
  Grid,
  GridItem,
  Box,
  Text,
  Divider,
  Badge,
  Flex,
  Button,
  HStack,
  Tooltip,
  Spinner as ChakraSpinner,
  Link as ChakraLink,
  Icon,
} from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import Spinner from '@components/Spinner';
import getDenomInfo, { DenomValue, getDenomName } from '@utils/getDenomInfo';
import Link from 'next/link';
import { generateStrategyTopUpUrl } from '@components/TopPanel/generateStrategyTopUpUrl';

import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import { useWallet } from '@hooks/useWallet';
import useValidator from '@hooks/useValidator';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { StrategyTypes } from '@models/StrategyTypes';
import { DELEGATION_FEE, SWAP_FEE } from 'src/constants';
import { getPrettyFee } from '@helpers/getPrettyFee';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyType,
  getStrategyStartDate,
  isStrategyCancelled,
  getStrategyName,
  getStrategyEndDate,
  getSlippageTolerance,
  getPriceCeilingFloor,
  getConvertedSwapAmount,
  isStrategyAutoStaking,
  isStrategyOperating,
  getStrategyProvideLiquidityConfig,
  isBuyStrategy,
  getStrategyExecutionInterval,
  getStrategyReinvestStrategyId,
} from '@helpers/strategy';
import { StrategyStatusBadge } from '@components/StrategyStatusBadge';

import { getEscrowAmount, getStrategyEndDateRange, getStrategySwapRange } from '@helpers/strategy/dcaPlus';
import { getChainContractAddress, getMarsAddress, getMarsUrl, getOsmosisWebUrl } from '@helpers/chains';
import { Chains, useChain } from '@hooks/useChain';
import { useOsmosisPools } from '@hooks/useOsmosisPools';
import { PoolDenomIcons } from '@components/PoolDenomIcons';
import { PoolDescription } from '@components/PoolDescription';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import useStrategy from '@hooks/useStrategy';
import { HiOutlineCube } from 'react-icons/hi';
import { generateStrategyConfigureUrl } from '@components/TopPanel/generateStrategyConfigureUrl';
import { CancelButton } from './CancelButton';

function Escrowed({ strategy }: { strategy: Strategy }) {
  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">
          {' '}
          <Tooltip
            label={
              <Text>
                A maximum of 5% swap volume, this amount with be returned in full if DCA+ does not outperform
                traditional DCA at the end of the strategy.
              </Text>
            }
          >
            Escrowed*
          </Tooltip>
        </Heading>
      </GridItem>
      <GridItem colSpan={2}>
        <Text fontSize="sm" data-testid="strategy-escrow-amount">
          {getEscrowAmount(strategy)} {getDenomName(getStrategyResultingDenom(strategy))}
        </Text>
      </GridItem>
    </>
  );
}

function LiquidityPool({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { data: pools } = useOsmosisPools();
  const pool = pools?.find((p) => p.id.toNumber() === getStrategyProvideLiquidityConfig()?.pool_id);
  return pool ? (
    <ChakraLink isExternal href={`${getOsmosisWebUrl()}/pool/${pool.id}`}>
      <HStack>
        <PoolDenomIcons pool={pool} />
        <Text>
          <PoolDescription pool={pool} />
        </Text>
      </HStack>
    </ChakraLink>
  ) : (
    <ChakraSpinner size="xs" />
  );
}

function SwapEachCycle({ strategy }: { strategy: Strategy }) {
  const { min, max } = getStrategySwapRange(strategy) || {};
  const { chain } = useChain();
  const { dexFee } = useDexFee(
    getStrategyInitialDenom(strategy),
    getStrategyResultingDenom(strategy),
    isBuyStrategy(strategy) ? TransactionType.Buy : TransactionType.Sell,
  );
  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Swap each cycle </Heading>
      </GridItem>
      <GridItem colSpan={2}>
        <Text fontSize="sm" data-testid="strategy-swap-amount">
          {isDcaPlus(strategy) ? (
            <>
              Between {min} and {max} {getDenomName(getStrategyInitialDenom(strategy))}
            </>
          ) : (
            <>
              {getConvertedSwapAmount(strategy)} {getDenomName(getStrategyInitialDenom(strategy))}
            </>
          )}{' '}
          -{' '}
          <Tooltip
            label={
              <Box>
                <Text>Fees automatically deducted from each swap:</Text>
                {!isDcaPlus(strategy) && <Text>CALC sustainability fee: {getPrettyFee(100, SWAP_FEE)}%</Text>}
                <Text>
                  {chain === Chains.Osmosis ? 'Osmosis swap' : 'Kujira'} fee: {getPrettyFee(100, dexFee)}%
                </Text>
                {isStrategyAutoStaking(strategy) && <Text>Automation fee: {getPrettyFee(100, DELEGATION_FEE)}%</Text>}
              </Box>
            }
          >
            fees*
          </Tooltip>
        </Text>
      </GridItem>
    </>
  );
}

function usePostSwapCallback(strategy: Strategy | StrategyOsmosis) {
  const { chain } = useChain();
  if (chain === Chains.Kujira) {
    return {
      validatorAddress: strategy.destinations.length && strategy.destinations[0].address,
    };
  }
  if (strategy.destinations.length) {
    const [destination] = (strategy as StrategyOsmosis).destinations;
    const { msg } = destination;
    if (msg) {
      const decoded = Buffer.from(msg, 'base64').toString('ascii');
      if (decoded) {
        const parsed = JSON.parse(decoded);
        return {
          validatorAddress: parsed?.z_delegate?.validator_address,
        };
      }
    }
  }
  return {
    validatorAddress: null,
  };
}

function ConfigureButton({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { chain } = useChain();
  return chain === Chains.Osmosis ? (
    <GridItem visibility={isStrategyCancelled(strategy) ? 'hidden' : 'visible'}>
      <Flex justify="end">
        <Link href={generateStrategyConfigureUrl(strategy.id)}>
          <Button size="xs" variant="ghost" colorScheme="brand" leftIcon={<Icon fontSize="md" as={HiOutlineCube} />}>
            Configure
          </Button>
        </Link>
      </Flex>
    </GridItem>
  ) : null;
}

function ReinvestDetails({ strategy }: { strategy: StrategyOsmosis }) {
  const id = getStrategyReinvestStrategyId(strategy);
  const { data } = useStrategy(id);

  const { vault: reinvestStrategy } = data || {};

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Reinvesting into</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        {!reinvestStrategy ? (
          <ChakraSpinner size="xs" />
        ) : (
          <ChakraLink isExternal href={`/strategies/details/?id=${id}`}>
            <Text fontSize="sm" data-testid="strategy-receiving-address">
              Your {getDenomName(getStrategyResultingDenom(reinvestStrategy))} strategy <Icon as={ExternalLinkIcon} />
            </Text>
          </ChakraLink>
        )}
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  );
}

function DestinationDetails({ strategy }: { strategy: Strategy | StrategyOsmosis }) {
  const { destinations } = strategy;
  const { chain } = useChain();

  const { address } = useWallet();

  const { validatorAddress } = usePostSwapCallback(strategy);

  const { validator, isLoading } = useValidator(validatorAddress);

  if (validator) {
    return (
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
        <GridItem colSpan={1}>
          <Text fontSize="sm" data-testid="strategy-validator-name">
            {isLoading ? <Spinner /> : validator?.description?.moniker}
          </Text>
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  if (getStrategyProvideLiquidityConfig()) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Providing liquidity to</Heading>
        </GridItem>
        <GridItem colSpan={1}>
          <Text fontSize="sm" data-testid="strategy-receiving-address">
            <LiquidityPool strategy={strategy} />
          </Text>
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  if (destinations[0].address === getMarsAddress()) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Depositing to</Heading>
        </GridItem>
        <GridItem colSpan={1}>
          <ChakraLink isExternal href={getMarsUrl()}>
            <Text fontSize="sm" data-testid="strategy-receiving-address">
              Mars
            </Text>
          </ChakraLink>
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  if (destinations[0].address === getChainContractAddress(chain)) {
    return <ReinvestDetails strategy={strategy as StrategyOsmosis} />;
  }

  if (destinations[0].address !== address) {
    return (
      <>
        <GridItem colSpan={1}>
          <Heading size="xs">Sending to </Heading>
        </GridItem>
        <GridItem colSpan={1}>
          {destinations[0].address === getMarsAddress() ? (
            <ChakraLink isExternal href={getMarsUrl()}>
              <Text fontSize="sm" data-testid="strategy-receiving-address">
                Mars
              </Text>
            </ChakraLink>
          ) : (
            <Text fontSize="sm" data-testid="strategy-receiving-address">
              {destinations[0].address}
            </Text>
          )}
        </GridItem>
        <ConfigureButton strategy={strategy} />
      </>
    );
  }

  return chain === Chains.Osmosis ? (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Post-swap action</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Badge>None</Badge>
      </GridItem>
      <ConfigureButton strategy={strategy} />
    </>
  ) : null;
}

export default function StrategyDetails({ strategy }: { strategy: Strategy }) {
  const { balance, destinations } = strategy;
  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const initialDenomValue = new DenomValue(balance);

  const strategyType = getStrategyType(strategy);

  const startDate = getStrategyStartDate(strategy);

  const { data: events } = useStrategyEvents(strategy.id);

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
              {isDcaPlus(strategy) && isStrategyOperating(strategy) ? (
                <>
                  Between {getStrategyEndDateRange(strategy, events).min} and{' '}
                  {getStrategyEndDateRange(strategy, events).max}
                </>
              ) : (
                getStrategyEndDate(strategy, events)
              )}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xs">Investment cycle</Heading>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="sm" data-testid="strategy-investment-cycle">
              {getStrategyExecutionInterval(strategy)}
            </Text>
          </GridItem>
          <SwapEachCycle strategy={strategy} />
          {isDcaPlus(strategy) && <Escrowed strategy={strategy} />}
          {Boolean(strategy.slippage_tolerance) && (
            <>
              <GridItem colSpan={1}>
                <Heading size="xs">Slippage tolerance</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize="sm" data-testid="strategy-slippage-tolerance">
                  {getSlippageTolerance(strategy)}
                </Text>
              </GridItem>
            </>
          )}
          {Boolean(strategy.minimum_receive_amount) && strategy.minimum_receive_amount && (
            <>
              <GridItem colSpan={1}>
                <Heading size="xs">{strategyType === StrategyTypes.DCAIn ? 'Price ceiling' : 'Price floor'}</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <HStack>
                  <Text fontSize="sm" data-testid="strategy-minimum-receive-amount">
                    {getPriceCeilingFloor(strategy)}{' '}
                    {getDenomInfo(strategyType === StrategyTypes.DCAIn ? initialDenom : resultingDenom).name}
                  </Text>
                  <Badge colorScheme="green">Set</Badge>
                </HStack>
              </GridItem>
            </>
          )}
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
          {Boolean(destinations.length) && <DestinationDetails strategy={strategy} />}
        </Grid>
      </Box>
    </GridItem>
  );
}
