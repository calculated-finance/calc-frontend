import { PlusSquareIcon } from '@chakra-ui/icons';
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
  useDisclosure,
  Button,
  Image,
} from '@chakra-ui/react';
import CancelStrategyModal from '@components/CancelStrategyModal';
import CalcIcon from '@components/Icon';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import { CloseBoxedIcon } from '@fusion-icons/react/interface';
import { Strategy } from '@hooks/useStrategies';
import useStrategy from '@hooks/useStrategy';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { useWallet } from '@wizard-ui/react';
import useStrategyEvents from '@hooks/useStrategyEvents';
import { getSidebarLayout } from '../../../components/Layout';
import { getStrategyType } from './getStrategyType';
import { getInitialDenom } from './getInitialDenom';
import { getResultingDenom } from './getResultingDenom';

export function CancelButton({ strategy }: { strategy: Strategy }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    router.push('/strategies');
  };

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        colorScheme="red"
        leftIcon={<CalcIcon as={CloseBoxedIcon} stroke="red.200" width={4} height={4} />}
        onClick={onOpen}
      >
        Cancel
      </Button>
      <CancelStrategyModal isOpen={isOpen} onClose={handleClose} onCancel={handleCancel} strategy={strategy} />
    </>
  );
}

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useStrategy(id as string);
  const { address } = useWallet();

  // const { data: eventsData, isLoading: eventsIsLoading } = useStrategyEvents();


  if (!data) {
    return (
      <Center h="100vh">
        <Spinner />;
      </Center>
    );
  }

  const { status, position_type, time_interval, swap_amount, balance, pair, destinations } = data?.vault || {};
  const initialDenom = getInitialDenom(position_type, pair);
  const resultingDenom = getResultingDenom(position_type, pair);

  const initialDenomValue = new DenomValue(balance);
  const swapAmountValue = new DenomValue({ denom: initialDenom!, amount: swap_amount });

  const strategyType = getStrategyType(data.vault);

  return (
    <>
      <HStack spacing={6} pb={6}>
        <Link href="/strategies">
          <IconButton aria-label="back" variant="outline">
            <Icon as={FiArrowLeft} stroke="brand.200" />
          </IconButton>
        </Link>
        <Heading>
          {strategyType} {id}
        </Heading>
      </HStack>

      <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="2fr">
        <GridItem colSpan={[6, null, null, null, 3]}>
          <Heading pb={4} size="md">
            Strategy details
          </Heading>
          <Box p={6} layerStyle="panel" minHeight={328}>
            {isLoading || !data?.vault ? (
              <Center h="full">
                <Spinner />
              </Center>
            ) : (
              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                <GridItem colSpan={1}>
                  <Heading size="xs">Strategy status</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Badge colorScheme={status === 'active' ? 'green' : 'blue'}>
                    {status === 'active' ? 'Active' : 'Completed'}
                  </Badge>
                </GridItem>
                <GridItem colSpan={1}>
                  <Flex justifyContent="end">
                    <CancelButton strategy={data.vault} />
                  </Flex>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Strategy name</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm">
                    {strategyType} {id}
                  </Text>
                </GridItem>
                <GridItem colSpan={3}>
                  <Divider />
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Strategy type</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm">{strategyType}</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Strategy start date</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Strategy end date</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Investment cycle</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm" textTransform="capitalize">
                    {time_interval || '-'}
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Purchase each cycle</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm">
                    {swapAmountValue.toConverted()} {getDenomInfo(initialDenom).name}{' '}
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Current amount in vault</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">
                    {initialDenomValue.toConverted()} {getDenomInfo(initialDenom).name}
                  </Text>
                </GridItem>
                <GridItem>
                  <Flex justify="end">
                    <Link href={`${id}/top-up`}>
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
                      <GridItem colSpan={2}>
                        <Badge colorScheme="green">Active</Badge>
                      </GridItem>
                      <GridItem colSpan={1}>
                        <Heading size="xs">Auto staking wallet address</Heading>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Text fontSize="sm">{destinations[0].address}</Text>
                      </GridItem>
                    </>
                  ) : (
                    destinations[0].address !== address && (
                      <>
                        <GridItem colSpan={1}>
                          <Heading size="xs">Sending to </Heading>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <Text fontSize="sm">{destinations[0].address} </Text>
                        </GridItem>
                      </>
                    )
                  ))}
              </Grid>
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={[6, null, null, null, 3]}>
          <GridItem>
            <Heading pb={4} size="md">
              Strategy performance
            </Heading>
          </GridItem>
          <Box p={6} layerStyle="panel" minHeight={328}>
            {isLoading || !data?.vault ? (
              <Center h="full">
                <Spinner />
              </Center>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                <GridItem colSpan={1}>
                  <Heading size="xs">Asset</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">
                    <Flex align="center" gap={2}>
                      {getDenomInfo(resultingDenom).name} <DenomIcon denomName={resultingDenom!} />
                    </Flex>
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Divider />
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Market value of holdings</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Total accumulated</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Net asset cost</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Average token cost</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">-</Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Divider />
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Profit/ Loss</Heading>
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
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={6}>
          <Box layerStyle="panel">
            <Heading p={4} size="md">
              Portfolio accumulated with this strategy
            </Heading>
            {/* <Stat>
              <StatNumber>
                {getDenomInfo(resultingDenom).conversion(Number(0))} {getDenomInfo(resultingDenom).name}
              </StatNumber>
            </Stat> */}
            <Box position="relative">
              <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="2px">
                <Heading>Coming Soon</Heading>
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
