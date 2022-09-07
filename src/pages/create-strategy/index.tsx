import { Button, Center, Flex, Heading, Link, Stack, Text, Image, Box, Badge, Spacer } from '@chakra-ui/react';
import Icon from '@components/Icon';
import {
  Code3Icon,
  DonateIcon,
  Fullscreen1Icon,
  Fullscreen2Icon,
  Graph1Icon,
  PuzzleIcon,
} from '@fusion-icons/react/interface';
import { useBalance, useExecuteContract, useQueryContract, useWallet } from '@wizard-ui/react';
import { useWalletModal } from 'src/hooks/useWalletModal';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';
import CONTRACT_ADDRESS from './CONTRACT_ADDRESS';

function InfoPanel() {
  return (
    <Stack rounded="2xl" direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          <Text as="span" color="blue.500">
            Dollar-cost averaging
          </Text>{' '}
          is one of the easiest techniques to reduce the volatility risk of investing in crypto, and it&apos;s a great
          way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
  );
}

function StrategyCard({ name, description, advanced, icon, href, linkToInfo, enabled }: any) {
  return (
    <Stack
      direction={['row', null, null, 'column']}
      p={4}
      layerStyle="panel"
      width={['full', null, null, 56]}
      rounded="2xl"
      gap={4}
    >
      <Flex direction="column" flexGrow={1}>
        <Flex mb={4}>
          <Icon stroke="brand.200" as={icon} width={8} height={8} />
          <Spacer />
          <Box>
            <Badge size="xs" colorScheme="blue">
              {advanced ? 'Advanced Strategy' : 'Basic Strategy'}
            </Badge>
          </Box>
        </Flex>
        <Heading size="md" mb={2}>
          {name}
        </Heading>
        <Text fontSize="xs">{description}</Text>
      </Flex>
      <Flex justifyContent="center" direction="column" alignContent="center">
        {enabled ? (
          <Button as="a" mb={2} href={href}>
            Get started
          </Button>
        ) : (
          <Button mb={2} cursor="unset" color="navy" colorScheme="grey">
            Coming soon
          </Button>
        )}

        <Link
          fontSize="sm"
          textAlign="center"
          variant="ghost"
          colorScheme="gray"
          href={linkToInfo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </Link>
      </Flex>
    </Stack>
  );
}

function CreatePair() {
  const { mutate, data, ...rest } = useExecuteContract({
    // contract address
    address: CONTRACT_ADDRESS,
  });

  // debug
  console.log('data', data);
  console.log('rest', rest);

  const handleClick = () => {
    mutate({
      // message to execute
      msg: {
        create_pair: {
          address: 'kujira1haf627g0ly96gyqwjpyyqqq4v5e76z5levjjmu',
          base_denom: 'DEMO',
          quote_denom: 'kuji',
        },
      },
    });
  };

  return (
    <Box>
      {data && <Text>{JSON.stringify(data)}</Text>}
      <Button onClick={handleClick}>
        <Text>create pair</Text>
      </Button>
    </Box>
  );
}

function AddStrategy() {
  const { mutate, ...rest } = useExecuteContract({
    // contract address
    address: CONTRACT_ADDRESS,
  });

  console.log('rest', rest);

  const handleClick = () => {
    mutate({
      // message to execute
      msg: {
        create_vault: {
          execution_interval: 'hourly',
          pair_address: 'kujira1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3sl8nek6',
          position_type: 'enter',
          swap_amount: '100',
          total_executions: 10,
          target_start_time_utc: '2022-09-22T05:48:31.056Z',
        },
      },
      funds: [{ denom: 'ukuji', amount: '1000' }],
    });
  };

  return <Button onClick={handleClick}>Add Strategy</Button>;
}

export function Balance() {
  const { address } = useWallet();

  const { data: balanceData } = useBalance({ address, token: 'ukuji' });

  const { data: pairsData, isLoading } = useQueryContract({
    address: CONTRACT_ADDRESS,
    msg: {
      get_all_pairs: {},
    },
  });

  const { data: vaultsData } = useQueryContract({
    address: CONTRACT_ADDRESS,
    msg: {
      get_all_active_vaults: {
        address,
      },
    },
  });

  return (
    <Box>
      <AddStrategy />
      <CreatePair />
      {balanceData && (
        <>
          <Heading>Wallet Balance</Heading>
          <Text>{balanceData} uKUJI</Text>
        </>
      )}
      {isLoading && <Text>Pairs Loading...</Text>}
      {pairsData && (
        <>
          <Heading>All pairs</Heading>
          <Text>
            {JSON.stringify(pairsData)}
            {pairsData.amount}
          </Text>
        </>
      )}

      {vaultsData && (
        <>
          <Heading>List of vaults</Heading>
          <Text>{JSON.stringify(vaultsData)}</Text>
        </>
      )}
    </Box>
  );
}

function Strategies() {
  return (
    <Stack direction="column" spacing={8}>
      <Box>
        <Heading mb={2} size="md">
          Accumulation strategies
        </Heading>
        <Text color="grey.200">
          You want to build a position in an asset.{' '}
          <Text as="span" color="green.200">
            The current Fear and Greed Score of 34 (Fear) indicates it&apos;s likely a good time to employee these
            strategies.
          </Text>
        </Text>
      </Box>
      <Flex gap={8} flexDirection="row" wrap="wrap">
        <StrategyCard
          name="Standard DCA In"
          description="Dollar-cost Average into an asset with ease."
          icon={Fullscreen2Icon}
          enabled
          href="/create-strategy/dca-in"
        />
        <StrategyCard
          name="Advanced DCA+"
          description="Invest into an asset with advanced DCA algorithms."
          advanced
          icon={Code3Icon}
        />
        <StrategyCard
          name="Buy the Dip"
          description="Auto-buy after a specified % dip in your favourite asset."
          advanced
          icon={Graph1Icon}
        />
        <StrategyCard
          name="Auto Rebalance"
          description="Automatically rebalance your portfolio after price movements."
          icon={PuzzleIcon}
        />
      </Flex>
      <InfoPanel />
      <Box>
        <Heading mb={2} size="md">
          Take profit strategies
        </Heading>
        <Text color="grey.200">You want to start selling assets because you have a good return on them already.</Text>
      </Box>
      <Flex gap={8} flexDirection="row" wrap="wrap">
        <StrategyCard
          name="Standard DCA Out"
          description="Dollar-cost Average out of an asset with ease."
          icon={Fullscreen1Icon}
          enabled
        />
        <StrategyCard
          name="Auto-take profit"
          description="Sell a certain % of an asset after it pumps a certain %"
          advanced
          icon={DonateIcon}
          enabled
        />
      </Flex>
    </Stack>
  );
}

// eslint-disable-next-line react/function-component-definition
const CreateStrategy: NextPageWithLayout = () => {
  const { address } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  return (
    <Stack direction="column" spacing={8}>
      <Stack spacing={2}>
        <Heading>Set up an investment strategy</Heading>
        <Text color="grey.200">
          The first complete fiat-to-crypto decentralised DCA (dollar-cost averaging) protocol that provides advanced
          algorithms for long-term investing.
        </Text>
      </Stack>

      {address ? (
        <Strategies />
      ) : (
        <>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            w="full"
            h="sm"
            p={4}
            rounded={5}
            layerStyle="panel"
          >
            <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" w="full" h="full">
              <Heading>No Wallet connected</Heading>
              <Center>Get started by connecting your wallet.</Center>
              <Button onClick={handleConnect}>Connect to a wallet</Button>
              <Text>
                Don&apos;t have a wallet?{' '}
                <Link href="https://www.keplr.app/" target="_blank" rel="noopener noreferrer">
                  Create one here
                </Link>
              </Text>
            </Stack>
          </Flex>
          <InfoPanel />
        </>
      )}
    </Stack>
  );
};

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
