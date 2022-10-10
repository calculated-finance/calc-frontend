import { Button, Heading, Text, Stack, Center, ButtonGroup, Image, HStack } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Icon from '@components/Icon';
import Spinner from '@components/Spinner';
import { BarChartIcon } from '@fusion-icons/react/interface';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import { useWallet } from '@wizard-ui/react';
import Link from 'next/link';

function Onboarding() {
  return (
    <>
      <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={2}>
        <Heading size="md">Ready to set up a CALC Strategy?</Heading>
        <Text fontSize="sm">
          CALC offers a range of mid-long term trading tools to help automate your investments, remove emotions and take
          back your time. In just 4 minutes, you can have CALC working for you with either take profit strategies or
          accumulation strategies.
        </Text>
      </Stack>
      <Link href="/create-strategy">
        <Button maxWidth={402} size="sm">
          Get Started
        </Button>
      </Link>
    </>
  );
}

function Returning() {
  return (
    <>
      <HStack>
        <Image src="/images/lightBulbOutline.svg" w={6} h={6} />
        <Text color="grey.200" fontSize="sm">
          No active strategies
        </Text>
      </HStack>
      <Stack spacing={2}>
        <Heading size="md">Ready to fire up CALC again?</Heading>
        <Text fontSize="sm">
          Match your investments to your goals, spread your &apos;eggs&apos; among multiple baskets, set up a purchase
          plan–and stick with it and backtest your previous startegies.
        </Text>
      </Stack>
      <ButtonGroup>
        <Link href="/create-strategy">
          <Button maxWidth={402} size="sm">
            Create new strategy
          </Button>
        </Link>
        <Link href="/performance">
          <Button maxWidth={402} size="sm" variant="outline">
            Review past performance
          </Button>
        </Link>
      </ButtonGroup>
    </>
  );
}

function Active() {
  return (
    <>
      <Icon as={BarChartIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={2}>
        <Heading size="md">Awesome - you have a DCA strategy active!</Heading>
        <Text fontSize="sm">
          Break free of FOMO, stop buying pico tops, it&apos;s time to get calculated with your investment approach.
          CALC is empowering investors with the tools to make investing emotionless.
        </Text>
      </Stack>
      <Stack direction={['column', 'column', 'row']} w="full" maxWidth={600}>
        <Link href="/strategies">
          <Button w="full" size="sm" colorScheme="blue">
            Top up my Strategy
          </Button>
        </Link>
        <Link href="/strategies">
          <Button w="full" size="sm" colorScheme="blue" variant="outline">
            Review performance
          </Button>
        </Link>
      </Stack>
    </>
  );
}

export default function TopPanel() {
  const { connected } = useWallet();

  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  const completedStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'inactive') ?? [];

  return (
    <Center
      borderWidth={2}
      borderColor={activeStrategies.length ? 'blue.200' : 'brand.200'}
      h="full"
      minHeight={294}
      layerStyle="panel"
      p={8}
    >
      {connected ? (
        isLoading ? (
          <Spinner />
        ) : (
          <Stack spacing={6}>
            {activeStrategies.length ? <Active /> : completedStrategies.length ? <Returning /> : <Onboarding />}
          </Stack>
        )
      ) : (
        <ConnectWallet h={undefined} />
      )}
    </Center>
  );
}
