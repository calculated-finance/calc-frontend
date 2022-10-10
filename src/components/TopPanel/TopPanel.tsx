import { Button, Heading, Text, Stack, Center } from '@chakra-ui/react';
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

function Active() {
  return (
    <>
      <Icon as={BarChartIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={2}>
        <Heading size="md">Awesome - you have a DCA strategy active!</Heading>
        <Text fontSize="sm">
          Break free of FOMO, stop buying pico tops, it’s time to get calculated with your investment approach. CALC is
          empowering investors with the tools to make investing emotionless.
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
          <Stack spacing={6}>{activeStrategies.length ? <Active /> : <Onboarding />}</Stack>
        )
      ) : (
        <ConnectWallet h={undefined} />
      )}
    </Center>
  );
}
