import { Button, Heading, Text, Stack, Center, ButtonGroup, Image, HStack, Box } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Icon from '@components/Icon';
import Spinner from '@components/Spinner';
import { BarChartIcon } from '@fusion-icons/react/interface';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
import { useWallet } from '@wizard-ui/react';
import Link from 'next/link';
import { generateStrategyDetailUrl } from './generateStrategyDetailUrl';
import { generateStrategyTopUpUrl } from './generateStrategyTopUpUrl';

function Onboarding() {
  return (
    <>
      <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={2}>
        <Heading size="md">Ready to set up a CALC Strategy?</Heading>
        <Text textStyle="body">
          CALC offers a range of mid-long term trading tools to help automate your investments, remove emotions and take
          back your time. In just 4 minutes, you can have CALC working for you with either take profit strategies or
          accumulation strategies.
        </Text>
      </Stack>
      <Link passHref href="/create-strategy">
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
        <Text color="grey.200" textStyle="body">
          No active strategies
        </Text>
      </HStack>
      <Stack spacing={2}>
        <Heading size="md">Ready to fire up CALC again?</Heading>
        <Text textStyle="body">
          Match your investments to your goals, spread your &apos;eggs&apos; among multiple baskets, set up a purchase
          plan–and stick with it and backtest your previous startegies.
        </Text>
      </Stack>
      <ButtonGroup>
        <Link passHref href="/create-strategy">
          <Button maxWidth={402} size="sm">
            Create new strategy
          </Button>
        </Link>
        <Link passHref href="/strategies">
          <Button maxWidth={402} size="sm" variant="outline">
            Review past strategies
          </Button>
        </Link>
      </ButtonGroup>
    </>
  );
}

function ActiveWithOne() {
  const { data } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  const activeStrategy = activeStrategies[0];
  const { balance } = activeStrategy;
  const balanceValue = new DenomValue(balance);

  const displayBalance = balanceValue.toConverted().toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 2,
  });
  return (
    <>
      <HStack align="center">
        <Icon as={BarChartIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
        <Text textStyle="body">
          {displayBalance} {getDenomInfo(balanceValue.denomId).name} remaining in vault
        </Text>
      </HStack>
      <Stack spacing={2}>
        <Heading size="md">Awesome - you have a DCA strategy active!</Heading>
        <Text textStyle="body">
          Break free of FOMO, stop buying pico tops, it&apos;s time to get calculated with your investment approach.
          CALC is empowering investors with the tools to make investing emotionless.
        </Text>
      </Stack>
      <Stack direction={['column', 'column', 'row']} w="full" maxWidth={600}>
        <Link passHref href={generateStrategyTopUpUrl(activeStrategy?.id)}>
          <Button w="full" size="sm" colorScheme="blue">
            Top up my Strategy
          </Button>
        </Link>
        <Link passHref href={generateStrategyDetailUrl(activeStrategy?.id)}>
          <Button w="full" size="sm" colorScheme="blue" variant="outline">
            Review performance
          </Button>
        </Link>
      </Stack>
    </>
  );
}

function ActiveWithMany() {
  const { data } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  return (
    <>
      <HStack align="center">
        <Icon as={BarChartIcon} stroke="green.200" strokeWidth={5} w={6} h={6} />
        <Text textStyle="body">You have {activeStrategies.length} strategies running</Text>
      </HStack>
      <Stack spacing={1}>
        <Heading size="md">Wow - you&apos;re a CALC pro.</Heading>
        <Text textStyle="body">
          You should be proud, you&apos;ve surpassed the basic stage of just running a single strategy and you&apos;re
          managing multiple. Be sure to share your backtesting results to spread the CALC love.
        </Text>
      </Stack>
      <Stack direction={['column', 'column', 'row']} w="full" maxWidth={600}>
        <Link passHref href="/strategies">
          <Button w="full" size="sm" colorScheme="green">
            See my strategies
          </Button>
        </Link>
        <Button
          as="a"
          w="full"
          size="sm"
          colorScheme="green"
          variant="outline"
          rel="noopener noreferrer"
          target="_blank"
          href="https://twitter.com/intent/tweet?text=I%27ve%20got%20a%20few%20strategies%20running%20on%20%40CALC_FINANCE%20-%20come%20check%20them%20out!%20App.calculated.fi"
        >
          Share with others
        </Button>
      </Stack>
    </>
  );
}

export default function TopPanel() {
  const { connected } = useWallet();

  const { data, isLoading } = useStrategies();
  const activeStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'active') ?? [];
  const completedStrategies = data?.vaults.filter((strategy: Strategy) => strategy.status === 'inactive') ?? [];

  const getConfig = () => {
    if (isLoading) {
      return {
        background: '/images/backgrounds/twist.svg',
        border: 'transparent',
        Content: Box,
      };
    }
    if (!activeStrategies.length) {
      if (!completedStrategies.length) {
        return {
          background: '/images/backgrounds/twist.svg',
          border: 'brand.200',
          Content: Onboarding,
        };
      }
      return {
        background: '/images/backgrounds/twist.svg',
        border: 'brand.200',
        Content: Returning,
      };
    }
    if (activeStrategies.length === 1) {
      return {
        background: '/images/backgrounds/twist.svg',
        border: 'blue.200',
        Content: ActiveWithOne,
      };
    }
    return {
      background: '/images/backgrounds/star.svg',
      border: 'green.200',
      Content: ActiveWithMany,
    };
  };

  const { background, border, Content } = getConfig();

  return connected ? (
    <Center position="relative" borderWidth={2} borderColor={border} h="full" minHeight={294} layerStyle="panel" p={8}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {/* <Box
              layerStyle="panel"
              backgroundImage={background}
              backgroundPosition="center"
              backgroundSize="cover"
              backgroundRepeat="no-repeat"
              position="absolute"
              filter="auto"
              h="full"
              w="full"
            /> */}
          <Stack spacing={4} backdropBlur="2px" backdropFilter="auto">
            <Content />
          </Stack>
        </>
      )}
    </Center>
  ) : (
    <ConnectWallet layerStyle="panel" />
  );
}
