import { ArrowLeftIcon } from '@chakra-ui/icons';
import { Heading, Grid, GridItem, Box, Text, HStack, IconButton, Icon, Divider } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { ArrowLeft2Icon, ArrowLeft3Icon, ArrowRight2Icon } from '@fusion-icons/react/interface';
import { StrategyBalance } from '@hooks/useStrategies';
import useStrategy from '@hooks/useStrategy';
import getDenomInfo from '@utils/getDenomInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';
import { getSidebarLayout } from '../../../components/Layout';

function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useStrategy(id as string);

  console.log(data);

  const { status, configuration, balances } = data?.vault || {};
  const { position_type, execution_interval, swap_amount, pair } = configuration || {};
  const { quote_denom, base_denom } = pair || {};

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
        <Heading>DCA In {id}</Heading>
      </HStack>
      <Grid gap={6} mb={6} templateColumns="repeat(6, 1fr)" templateRows="2fr">
        <GridItem colSpan={3}>
          <Heading pb={4} size="md">
            Strategy details
          </Heading>
          <Box p={4} layerStyle="panel" h={328}>
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <GridItem colSpan={1}>
                <Heading size="sm">Strategy status</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">{status}</Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Strategy name</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">DCA In {id}</Text>
              </GridItem>
              <GridItem colSpan={2}>
                <Divider />
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Strategy type</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">{position_type}</Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Strategy start date</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">-</Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Strategy end date</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">-</Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Investment cycle</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">{execution_interval || '-'}</Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Purchase each cycle</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">{swap_amount || '-'}</Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Heading size="sm">Current amount in vault</Heading>
              </GridItem>
              <GridItem colSpan={1}>
                <Text size="sm">
                  {currentAmount} {getDenomInfo(quote_denom).name}
                </Text>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          <GridItem>
            <Heading pb={4} size="md">
              Strategy performance
            </Heading>
          </GridItem>
          <Box p={4} layerStyle="panel" h={328}>
            <Heading size="sm">Asset</Heading>
            <Text>
              <Text>{getDenomInfo(base_denom).name}</Text>
              <DenomIcon denomName={base_denom!} />
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={6}>
          <Box p={4} layerStyle="panel" h={328}>
            <Heading pb={4} size="md">
              Portfolio accumulated with this strategy
            </Heading>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}

Page.getLayout = getSidebarLayout;

export default Page;
