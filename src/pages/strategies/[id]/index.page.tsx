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
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Image,
} from '@chakra-ui/react';
import CancelStrategyModal from '@components/CancelStrategyModal';
import CalcIcon from '@components/Icon';
import DenomIcon from '@components/DenomIcon';
import Spinner from '@components/Spinner';
import { CloseBoxedIcon } from '@fusion-icons/react/interface';
import { Strategy, StrategyBalance } from '@hooks/useStrategies';
import useStrategy from '@hooks/useStrategy';
import getDenomInfo from '@utils/getDenomInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { getSidebarLayout } from '../../../components/Layout';

export function CancelButton({ strategy }: { strategy: Strategy }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const handleClose = () => {
    onClose();
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
      <CancelStrategyModal isOpen={isOpen} onClose={handleClose} strategy={strategy} />
    </>
  );
}

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useStrategy(id as string);

  console.log(data);

  const { status, configuration, balances } = data?.vault || {};
  const { position_type, execution_interval, swap_amount, pair } = configuration || {};
  const { quote_denom, base_denom } = pair || {};

  const strategyType = position_type === 'enter' ? 'DCA In' : 'DCA Out';

  const currentAmount = balances
    ?.map((balance: StrategyBalance) => Number(balance.amount))
    .reduce((amount: number, total: number) => amount + total, 0);

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
          <Box p={6} layerStyle="panel" h={328}>
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
                  <Badge colorScheme={status === 'active' ? 'green' : undefined} textTransform="capitalize">
                    {status}
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
                  <Text fontSize="sm">{execution_interval || '-'}</Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Purchase each cycle</Heading>
                </GridItem>
                <GridItem colSpan={2}>
                  <Text fontSize="sm">
                    {getDenomInfo(quote_denom).conversion(Number(swap_amount))} {getDenomInfo(quote_denom).name}{' '}
                  </Text>
                </GridItem>
                <GridItem colSpan={1}>
                  <Heading size="xs">Current amount in vault</Heading>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text fontSize="sm">
                    {getDenomInfo(quote_denom).conversion(currentAmount!)} {getDenomInfo(quote_denom).name}
                  </Text>
                </GridItem>
                <GridItem>
                  <Flex justify="end">
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="brand"
                      leftIcon={<CalcIcon as={PlusSquareIcon} stroke="brand.200" width={4} height={4} />}
                    >
                      Add more funds
                    </Button>
                  </Flex>
                </GridItem>
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
          <Box p={6} layerStyle="panel" h={328}>
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
                      {getDenomInfo(base_denom).name} <DenomIcon denomName={base_denom!} />
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
          <Box p={4} layerStyle="panel" h={328}>
            <Heading pb={4} size="md">
              Portfolio accumulated with this strategy
            </Heading>
            <Stat>
              <StatNumber>
                {getDenomInfo(quote_denom).conversion(Number(currentAmount))} {getDenomInfo(quote_denom).name}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
            <Box position="relative">
              <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="2px">
                <Heading>Coming Soon</Heading>
              </Center>
              <Image src="/images/dummyChart.svg" />
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
