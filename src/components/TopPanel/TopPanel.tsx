import { Button, Heading, Text, Stack, Center, Image, HStack, Box, GridItem, Flex } from '@chakra-ui/react';
import Icon from '@components/Icon';
import Spinner from '@components/Spinner';
import { BarChartIcon, Block3DIcon, KnowledgeIcon } from '@fusion-icons/react/interface';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import getDenomInfo, { DenomValue } from '@utils/getDenomInfo';
import { useWallet } from '@hooks/useWallet';
import Link from 'next/link';
import { isStrategyOperating } from '@helpers/strategy';
import { useDenom } from '@hooks/useDenom/useDenom';
import { generateStrategyDetailUrl } from './generateStrategyDetailUrl';
import { generateStrategyTopUpUrl } from './generateStrategyTopUpUrl';

function Onboarding() {
  return (
    <>
      <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
      <Stack spacing={1}>
        <Heading size="md">Ready to set up a CALC Strategy?</Heading>
        <Text fontSize="sm">
          CALC offers a range of mid-long term trading tools to help automate your investments, remove emotions and take
          back your time. In just 4 minutes, you can have CALC working for you with either take profit strategies or
          accumulation strategies.
        </Text>
      </Stack>
      <Link passHref href="/create-strategy">
        <Button maxWidth={402} size="sm">
          Get started
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
      <Stack spacing={1}>
        <Heading size="md">Ready to fire up CALC again?</Heading>
        <Text fontSize="sm">
          Match your investments to your goals, spread your &apos;eggs&apos; among multiple baskets, set up a purchase
          plan–and stick with it and backtest your previous strategies.
        </Text>
      </Stack>
      <Stack direction={{ base: 'column', sm: 'row' }}>
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
      </Stack>
    </>
  );
}

function ActiveWithOne() {
  const { data } = useStrategies();
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
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
        <Icon as={Block3DIcon} stroke="blue.200" strokeWidth={5} w={6} h={6} />
        <Text textStyle="body">
          {displayBalance} {getDenomInfo(balanceValue.denomId).name} remaining in vault
        </Text>
      </HStack>
      <Stack spacing={1}>
        <Heading size="md">Awesome - you have a calculated strategy active!</Heading>
        <Text fontSize="sm">You have the ability to edit and fine tune your strategy at any time.</Text>
      </Stack>
      <Stack direction={['column', 'column', 'row']} w="full" maxWidth={600}>
        <Link passHref href={generateStrategyTopUpUrl(activeStrategy?.id)}>
          <Button w="full" size="sm" colorScheme="blue">
            Top up my strategy
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
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
  return (
    <>
      <HStack align="center">
        <Icon as={KnowledgeIcon} stroke="green.200" strokeWidth={5} w={6} h={6} />
        <Text textStyle="body">You have {activeStrategies.length} strategies running</Text>
      </HStack>
      <Stack spacing={1}>
        <Heading size="md">Wow - you&apos;re a CALC pro.</Heading>
        <Text fontSize="sm">
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
  const activeStrategies = data?.vaults.filter(isStrategyOperating) ?? [];
  const completedStrategies = data?.vaults.filter((strategy: Strategy) => !isStrategyOperating(strategy)) ?? [];

  const getConfig = () => {
    if (connected && isLoading) {
      return {
        background: '/images/backgrounds/twist-thin.svg',
        border: 'transparent',
        Content: Box,
      };
    }
    if (!activeStrategies.length) {
      if (!completedStrategies.length) {
        return {
          background: '/images/backgrounds/twist-thin.svg',
          border: 'brand.200',
          Content: Onboarding,
        };
      }
      return {
        background: '/images/backgrounds/twist-thin.svg',
        border: 'brand.200',
        Content: Returning,
      };
    }
    if (activeStrategies.length === 1) {
      return {
        background: '/images/backgrounds/spiral-thin.svg',
        border: 'blue.200',
        Content: ActiveWithOne,
      };
    }
    return {
      background: '/images/backgrounds/star-thin.svg',
      border: 'green.200',
      Content: ActiveWithMany,
    };
  };

  const { background, border, Content } = getConfig();
  const colSpan = { base: 6, lg: activeStrategies.length ? 4 : 6 };

  return (
    <GridItem
      position="relative"
      borderWidth={2}
      layerStyle="panel"
      borderColor={border}
      colSpan={colSpan}
      minHeight={222}
    >
      {connected && isLoading ? (
        <Center h="full">
          <Spinner />
        </Center>
      ) : (
        <Flex>
          <Box
            backgroundImage={background}
            backgroundPosition="right"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            position="absolute"
            h="full"
            w="full"
            borderRadius="2xl"
          />
          <Stack zIndex={1} spacing={4} m={0} p={8} bg="transparent">
            <Content />
          </Stack>
        </Flex>
      )}
    </GridItem>
  );
}
