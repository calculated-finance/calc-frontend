import { Button, Flex, Heading, Stack, Text, Image, Box, Badge, Spacer, Wrap, Spinner } from '@chakra-ui/react';
import Icon from '@components/Icon';
import NextLink from 'next/link';
import { Code3Icon, Fullscreen1Icon, Fullscreen2Icon } from '@fusion-icons/react/interface';
import { ReactElement } from 'react';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { useRouter } from 'next/router';
import { getSidebarLayout } from '@components/Layout';
import StrategyUrls from './StrategyUrls';
import 'isomorphic-fetch';

type StrategyCardProps = {
  name: string;
  description: string;
  icon: ReactElement;
  enabled?: boolean;
  href?: StrategyUrls;
  advanced?: boolean;
  learnMoreHref: string;
};

const accumulationStratgies: StrategyCardProps[] = [
  {
    name: 'Standard DCA In',
    description: 'Customise your own dollar-cost average buying strategy.',
    icon: <Icon stroke="white" strokeWidth={2} as={Fullscreen2Icon} width={8} height={8} />,
    enabled: true,
    href: StrategyUrls.DCAIn,
    learnMoreHref: 'https://calculated.fi/standard-dca-in',
  },
  {
    name: 'Algorithm DCA+ In',
    description: 'Let our machine learning DCA algorithms invest for you.',
    advanced: true,
    icon: <Icon stroke="white" strokeWidth={2} as={Code3Icon} width={8} height={8} />,
    learnMoreHref: 'https://calculated.fi/algorithm-dca-in',
  },
  {
    name: 'Buy the Dip',
    description: 'Auto-buy after a specified % dip in your favourite asset.',
    advanced: true,
    icon: <Image src="/images/trendIcon.svg" width={8} height={8} />,
    learnMoreHref: 'https://calculated.fi/buy-the-dip',
  },
];

const takeProfitStrategies: StrategyCardProps[] = [
  {
    name: 'Standard DCA Out',
    description: 'Dollar-cost average out of an asset with ease.',
    icon: <Icon stroke="white" strokeWidth={2} as={Fullscreen1Icon} width={8} height={8} />,
    enabled: true,
    href: StrategyUrls.DCAOut,
    learnMoreHref: 'https://calculated.fi/standard-dca-out',
  },
  {
    name: 'Algorithm DCA+ Out',
    description: 'Let our machine learning DCA algorithms sell for you.',
    advanced: true,
    icon: <Icon stroke="white" strokeWidth={2} as={Code3Icon} width={8} height={8} />,
    learnMoreHref: 'https://calculated.fi/algorithm-dca-out',
  },
  {
    name: 'Auto-take Profit',
    description: 'Sell a certain % of an asset after it pumps a certain %.',
    advanced: true,

    icon: <Image src="/images/dollarIcon.svg" width={8} height={8} />,
    enabled: false,
    learnMoreHref: 'https://calculated.fi/auto-take-profit',
  },
];

function InfoPanel(): JSX.Element {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text textStyle="body">
          Dollar-cost averaging is one of the easiest techniques to reduce the volatility risk of investing in crypto,
          and it&apos;s a great way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
  );
}

function StrategyCard({ name, description, advanced, icon, href, learnMoreHref, enabled }: StrategyCardProps) {
  const { query } = useRouter();
  return (
    <Stack direction={['row', null, null, 'column']} p={4} layerStyle="panel" width={['full', null, null, 56]} gap={4}>
      <Flex direction="column" flexGrow={1}>
        <Flex mb={4}>
          {icon}
          <Spacer />
          <Box>
            <Badge size="xs" colorScheme={advanced ? 'blue' : undefined}>
              {advanced ? 'Advanced Strategy' : 'Basic Strategy'}
            </Badge>
          </Box>
        </Flex>
        <Heading size="md" mb={2}>
          {name}
        </Heading>
        <Text textStyle="body-xs">{description}</Text>
      </Flex>
      <Flex justifyContent="center" direction="column" alignContent="center">
        {enabled ? (
          <NextLink href={{ pathname: href ?? '#', query }}>
            <Button mb={2}>Get started</Button>
          </NextLink>
        ) : (
          <Button mb={2} cursor="unset" color="navy" colorScheme="grey">
            Coming soon
          </Button>
        )}

        <NextLink href={learnMoreHref} passHref>
          <Button as="a" target="_blank" colorScheme="blue" variant="ghost">
            Learn more
          </Button>
        </NextLink>
      </Flex>
    </Stack>
  );
}

StrategyCard.defaultProps = {
  enabled: false,
  href: undefined,
  advanced: false,
};

function useFearAndGreed() {
  const { data, isLoading } = useQueryWithNotification(['fear-and-greed-index'], async () => {
    const response = await fetch(`https://api.alternative.me/fng/`);
    if (!response.ok) {
      throw new Error('Failed to fetch fear and greed index.');
    }
    return response.json();
  });
  return {
    index: data?.data[0].value,
    classification: data?.data[0].value_classification,
    isLoading,
  };
}

function FearGreedStrategyRecommendation({ isAccumulation }: { isAccumulation?: boolean }) {
  const { index, classification, isLoading } = useFearAndGreed();
  const setStrategyRecommendation = isAccumulation ? 'accumulation' : 'take profit';

  return (
    <Badge colorScheme="green" px={4} py={1} layerStyle="panel" whiteSpace="normal" bg="deepHorizon" textAlign="center">
      {isLoading ? (
        <Spinner w={3} h={3} />
      ) : index ? (
        <>
          According to the{' '}
          <NextLink passHref href="https://alternative.me/crypto/fear-and-greed-index/">
            <Text as="a" textDecoration="underline" target="_blank">
              Fear &amp; Greed index score
            </Text>
          </NextLink>
          : {index} ({classification}), it may be a good time to use{' '}
          {setStrategyRecommendation} strategies
        </>
      ) : null}
    </Badge>
  );
}

function Strategies() {
  const { index } = useFearAndGreed();
  const showFearAndGreedAccumulate = index < 41;
  const showFearAndGreedProfit = index > 59;

  return (
    <Stack direction="column" spacing={8}>
      <Box>
        <Wrap spacing={2} pb={1} shouldWrapChildren align="center">
          <Heading size="md">Accumulation strategies</Heading>
          {showFearAndGreedAccumulate && <FearGreedStrategyRecommendation isAccumulation />}
        </Wrap>
        <Text pb={4} textStyle="body">
          Strategies that build a position in an asset.{' '}
        </Text>
        <Flex gap={8} flexDirection="row" wrap="wrap">
          {accumulationStratgies.map((strategy) => (
            <StrategyCard key={strategy.name} {...strategy} />
          ))}
        </Flex>
      </Box>

      <InfoPanel />
      <Box>
        <Wrap spacing={2} pb={1} shouldWrapChildren align="center">
          <Heading mb={1} size="md">
            Take Profit strategies
          </Heading>
          {showFearAndGreedProfit && <FearGreedStrategyRecommendation />}
        </Wrap>
        <Text pb={4} textStyle="body">
          Strategies that sell assets for profit.
        </Text>
        <Flex gap={8} flexDirection="row" wrap="wrap">
          {takeProfitStrategies.map((strategy) => (
            <StrategyCard key={strategy.name} {...strategy} />
          ))}
        </Flex>
      </Box>
      <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
        <Image src="/images/moneyBag.svg" />
        <Flex alignItems="center">
          <Text textStyle="body">
            If you can learn anything from the Luna crash, it&apos;s don&apos;t marry your bags. Always be objective and
            if you don&apos;t take your profits, then someone else will.
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
}

function CreateStrategy() {
  return (
    <Stack direction="column" spacing={8}>
      <Stack spacing={2}>
        <Heading size="lg">Set up an investment strategy</Heading>
        <Text textStyle="body">Save time by automating your investing and profit-taking with CALC.</Text>
      </Stack>

      <Strategies />
    </Stack>
  );
}

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
