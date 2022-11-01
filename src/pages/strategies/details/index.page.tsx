import { PlusSquareIcon, WarningIcon, WarningTwoIcon } from '@chakra-ui/icons';
import {
  Heading,
  Grid,
  GridItem,
  Box,
  Text,
  HStack,
  IconButton,
  Icon,
  Divider,
  Badge,
  Center,
  Flex,
  Button,
  Image,
  Alert,
  AlertIcon,
  Stack,
  useDisclosure,
  CloseButton,
  Spacer,
} from '@chakra-ui/react';
import CalcIcon from '@components/Icon';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import { ArrowRightIcon, CloseBoxedIcon } from '@fusion-icons/react/interface';
import useStrategy from '@hooks/useStrategy';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '@wizard-ui/react';
import { generateStrategyTopUpUrl } from '@components/TopPanel/generateStrategyTopUpUrl';
import { isStrategyCancelled, isStrategyOperating } from 'src/helpers/getStrategyStatus';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { getStrategyName } from 'src/helpers/getStrategyName';
import { getSidebarLayout } from '../../../components/Layout';
import { getStrategyType } from '../../../helpers/getStrategyType';
import { getInitialDenom } from '../../../helpers/getInitialDenom';
import { getResultingDenom } from '../../../helpers/getResultingDenom';
import { StrategyStatusBadge } from '../../../components/StrategyStatusBadge';
import { getStrategyStartDate } from '../../../helpers/getStrategyStartDate';
import { CancelButton } from './CancelButton';

function Diagram({ initialDenom, resultingDenom }: any) {
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  return (
    <HStack spacing={5}>
      <HStack>
        <DenomIcon size={5} denomName={initialDenom} />
        <Text>{initialDenomName}</Text>
      </HStack>
      <CalcIcon as={ArrowRightIcon} stroke="grey" />
      <HStack>
        <DenomIcon size={5} denomName={resultingDenom} />
        <Text>{resultingDenomName}</Text>
      </HStack>
    </HStack>
  );
}

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useStrategy(id as string);
  const { data: eventsData } = useStrategyEvents(id as string);

  const { address } = useWallet();

  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  // stats
  const completedEvents = eventsData?.events
    .filter((event: any) => event.data?.d_c_a_vault_execution_completed !== undefined)
    .map((event: any) => event.data?.d_c_a_vault_execution_completed);

  const marketValueAmount = completedEvents
    ?.map((event: any) => event?.received.amount)
    .reduce((total: number, amount: number) => Number(amount) + Number(total), 0);

  const costAmount = completedEvents
    ?.map((event: any) => event?.sent.amount)
    .reduce((total: number, amount: number) => Number(amount) + Number(total), 0);

  const lastSwapSlippageError =
    eventsData?.events?.slice(-1)[0]?.data?.d_c_a_vault_execution_skipped?.reason === 'slippage_tolerance_exceeded';

  if (!data) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  const { status, position_type, time_interval, swap_amount, balance, pair, destinations } = data.vault;
  const initialDenom = getInitialDenom(position_type, pair);
  const resultingDenom = getResultingDenom(position_type, pair);

  const marketValueValue = new DenomValue({ amount: marketValueAmount, denom: resultingDenom! });
  const costValue = new DenomValue({ amount: costAmount, denom: initialDenom! });

  const initialDenomValue = new DenomValue(balance);
  const swapAmountValue = new DenomValue({ denom: initialDenom!, amount: swap_amount });

  const strategyType = getStrategyType(data.vault);

  const startDate = getStrategyStartDate(data.vault);

  const targetTime = data?.trigger?.configuration?.time?.target_time;

  const targetPrice = data?.trigger?.configuration.f_i_n_limit_order?.target_price;

  let nextSwapInfo;
  if (isStrategyOperating(data.vault)) {
    if (targetTime) {
      const nextSwapDate = new Date(Number(data.trigger.configuration.time?.target_time) / 1000000).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
      );

      const nextSwapTime = new Date(Number(data.trigger.configuration.time?.target_time) / 1000000).toLocaleTimeString(
        'en-US',
        {
          minute: 'numeric',
          hour: 'numeric',
        },
      );
      nextSwapInfo = (
        <>
          {nextSwapDate} at {nextSwapTime}
        </>
      );
    } else if (targetPrice) {
      nextSwapInfo = (
        <>
          When 1 {getDenomInfo(resultingDenom).name} &le; {getDenomInfo(initialDenom).conversion(Number(targetPrice))}{' '}
          {getDenomInfo(initialDenom).name}
        </>
      );
    }
  }

  return (
    <>
      <HStack spacing={6} pb={6}>
        <Link href="/strategies">
          <IconButton aria-label="back" variant="outline">
            <Icon as={FiArrowLeft} stroke="brand.200" />
          </IconButton>
        </Link>

        <HStack spacing={8} alignItems="center">
          <Heading data-testid="details-heading">{getStrategyName(data.vault)}</Heading>
          <Flex w={200}>
            <Diagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
          </Flex>
        </HStack>
      </HStack>

      {Boolean(lastSwapSlippageError) && isVisible && (
        <Alert status="warning" mb={8}>
          <Image mr={4} src="/images/warningIcon.svg" />
          <Text fontSize="sm" mr={4}>
            The previous swap failed due to slippage being exceeded - your funds are safe, and the next swap is
            scheduled.
          </Text>
          <Spacer />

          <CalcIcon as={CloseBoxedIcon} stroke="white" onClick={onClose} />
        </Alert>
      )}

      {Boolean(nextSwapInfo) && (
        <HStack
          mb={8}
          py={4}
          px={8}
          layerStyle="panel"
          spacing={4}
          backgroundImage="/images/backgrounds/thin.svg"
          backgroundPosition="center"
          backgroundSize="cover"
        >
          <Heading size="xs">Next swap:</Heading>
          <Text fontSize="sm" data-testid="next-swap-info">
            {nextSwapInfo}
          </Text>
        </HStack>
      )}

      <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="2fr" alignItems="stretch">
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
                <StrategyStatusBadge strategy={data.vault} />
              </GridItem>
              <GridItem colSpan={1} visibility={isStrategyCancelled(data.vault) ? 'hidden' : 'visible'}>
                <Flex justifyContent="end">
                  <CancelButton strategy={data.vault} />
                </Flex>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="xs">Strategy name</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize="sm" data-testid="strategy-name">
                  {getStrategyName(data.vault)}
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
                <Heading size="xs">Strategy end date</Heading>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize="sm" data-testid="strategy-end-date">
                  -
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
              <GridItem visibility={isStrategyCancelled(data.vault) ? 'hidden' : 'visible'}>
                <Flex justify="end">
                  <Link href={generateStrategyTopUpUrl(id as string)}>
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
                      <Heading size="xs">Auto staking wallet address</Heading>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text fontSize="sm" data-testid="strategy-auto-staking-wallet-address">
                        {destinations[0].address}
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
        <GridItem colSpan={[6, null, null, null, 3]}>
          <Flex h="full" flexDirection="column">
            <Heading pb={4} size="md">
              Strategy performance
            </Heading>
            <Flex layerStyle="panel" flexGrow={1} alignItems="start">
              <Grid templateColumns="repeat(2, 1fr)" gap={3} px={8} py={6} w="full">
                <GridItem colSpan={1}>
                  <Heading size="xs">Asset in</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Flex align="center" gap={2} data-testid="strategy-resulting-denom">
                    <Text fontSize="sm">{getDenomInfo(initialDenom).name}</Text> <DenomIcon denomName={initialDenom!} />
                  </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Asset out</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Flex align="center" gap={2} data-testid="strategy-resulting-denom">
                    <Text fontSize="sm">{getDenomInfo(resultingDenom).name}</Text>{' '}
                    <DenomIcon denomName={resultingDenom!} />
                  </Flex>
                </GridItem>
                <GridItem colSpan={2}>
                  <Divider />
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">
                    {data.vault.position_type === 'enter' ? 'Market value of holdings' : 'Market value of profits'}
                  </Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">
                    {data.vault.position_type === 'enter' ? 'Total accumulated' : 'Total sold'}
                  </Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">
                    {data.vault.position_type === 'enter'
                      ? `${marketValueValue.toConverted()} ${getDenomInfo(marketValueValue.denomId).name}`
                      : `${costValue.toConverted()} ${getDenomInfo(costValue.denomId).name}`}
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">
                    {data.vault.position_type === 'enter' ? 'Net asset cost' : 'Net asset profit'}
                  </Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">
                    {data.vault.position_type === 'enter'
                      ? `${costValue.toConverted()} ${getDenomInfo(costValue.denomId).name}`
                      : `${marketValueValue.toConverted()} ${getDenomInfo(marketValueValue.denomId).name}`}
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">
                    {data.vault.position_type === 'enter' ? 'Average token cost' : 'Average token sell price'}
                  </Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Divider />
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Profit/Loss</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">% change</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
              </Grid>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={6}>
          <Box layerStyle="panel">
            <Heading p={6} size="md">
              Portfolio accumulated with this strategy
            </Heading>
            {/* <Stat>
              <StatNumber>
                {getDenomInfo(resultingDenom).conversion(Number(0))} {getDenomInfo(resultingDenom).name}
              </StatNumber>
            </Stat> */}
            <Box position="relative">
              <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="2px">
                <Heading>Coming soon</Heading>
              </Center>
              <Image borderBottomRadius="2xl" w="full" h="full" src="/images/dummyChart.svg" />
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
