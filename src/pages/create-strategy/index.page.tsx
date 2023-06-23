import { Button, Flex, Heading, Stack, Text, Image, Box, Badge, Spacer, Wrap, Spinner } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { Code3Icon, Fullscreen1Icon, Fullscreen2Icon } from '@fusion-icons/react/interface';
import { ReactElement } from 'react';
import { FiDivide } from 'react-icons/fi';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { useRouter } from 'next/router';
import { getSidebarLayout } from '@components/Layout';
import { isV2Enabled } from '@helpers/version/isV2Enabled';
import { useChain } from '@hooks/useChain';
import { useWallet } from '@hooks/useWallet';
import LinkWithQuery from '@components/LinkWithQuery';
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

function InfoPanel(): JSX.Element {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text textStyle="body">
          Remember, marketing material is typically designed to make you feel emotional and impulsive. Don&apos;t let
          fear and hype make your decisions for you.
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
          <LinkWithQuery href={{ pathname: href ?? '', query }}>
            <Button mb={2}>Get started</Button>
          </LinkWithQuery>
        ) : (
          <Button mb={2} cursor="unset" color="navy" colorScheme="grey">
            Coming soon
          </Button>
        )}

        <LinkWithQuery href={learnMoreHref} passHref>
          <Button as="a" target="_blank" colorScheme="blue" variant="ghost">
            Learn more
          </Button>
        </LinkWithQuery>
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
          <LinkWithQuery passHref href="https://alternative.me/crypto/fear-and-greed-index/">
            <Text as="a" textDecoration="underline" target="_blank">
              Fear &amp; Greed index score
            </Text>
          </LinkWithQuery>
          : {index} ({classification}), it may be a good time to use {setStrategyRecommendation} strategies
        </>
      ) : null}
    </Badge>
  );
}

function Strategies() {
  const { index } = useFearAndGreed();

  const { address } = useWallet();

  const { chain } = useChain();

  const showFearAndGreedAccumulate = index < 41;
  const showFearAndGreedProfit = index > 59;

  function accumulationStratgies(): StrategyCardProps[] {
    const strategies = [
      {
        name: 'Standard DCA In',
        description: 'Customise your own dollar-cost average buying strategy.rawData.',
        icon: <Icon stroke="white" strokeWidth={2} as={Fullscreen2Icon} width={8} height={8} />,
        enabled: true,
        href: StrategyUrls.DCAIn,
        learnMoreHref: 'https://calculated.fi/standard-dca-in',
      },
      {
        name: 'Algorithm DCA+ In',
        description: 'DCA into large cap assets based on market risk.',
        advanced: true,
        href: StrategyUrls.DCAPlusIn,
        enabled: true,
        icon: <Icon stroke="white" strokeWidth={2} as={Code3Icon} width={8} height={8} />,
        learnMoreHref: 'https://calculated.fi/algorithm-dca-in',
      },
    ] as StrategyCardProps[];

    if (isV2Enabled(chain, address)) {
      strategies.push({
        name: 'Weighted Scale In',
        description: 'Buy more when the price is low, and less when the price is high.',
        advanced: true,
        enabled: true,
        icon: <Icon stroke="white" strokeWidth="px" as={FiDivide} width={8} height={8} />,
        href: StrategyUrls.WeightedScaleIn,
        learnMoreHref: 'https://calculated.fi/weighted-scale-in',
      });
    }
    return strategies;
  }

  function takeProfitStrategies(): StrategyCardProps[] {
    const strategies = [
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
        description: 'DCA out of large cap assets based on market risk.',
        advanced: true,
        href: StrategyUrls.DCAPlusOut,
        icon: <Icon stroke="white" strokeWidth={2} as={Code3Icon} width={8} height={8} />,
        enabled: true,
        learnMoreHref: 'https://calculated.fi/algorithm-dca-out',
      },
    ] as StrategyCardProps[];

    if (isV2Enabled(chain, address)) {
      strategies.push({
        name: 'Weighted Scale Out',
        description: 'Sell more when the price is high, and less when the price is low.',
        advanced: true,
        enabled: true,
        href: StrategyUrls.WeightedScaleOut,
        icon: <Icon stroke="white" strokeWidth="px" as={FiDivide} width={8} height={8} />,
        learnMoreHref: 'https://calculated.fi/weighted-scale-in',
      });
    }

    return strategies;
  }

  return (
    <Stack direction="column" spacing={8}>
      <Stack>
        <Wrap spacing={2} pb={1} shouldWrapChildren align="center">
          <Heading size="md">Accumulation strategies</Heading>
          {showFearAndGreedAccumulate && <FearGreedStrategyRecommendation isAccumulation />}
        </Wrap>
        <Flex gap={8} flexDirection="row" wrap="wrap">
          {accumulationStratgies().map((strategy) => (
            <StrategyCard key={strategy.rawData.name} {...strategy} />
          ))}
        </Flex>
      </Stack>

      <InfoPanel />
      <Stack>
        <Wrap spacing={2} pb={1} shouldWrapChildren align="center">
          <Heading mb={1} size="md">
            Take Profit strategies
          </Heading>
          {showFearAndGreedProfit && <FearGreedStrategyRecommendation />}
        </Wrap>
        <Flex gap={8} flexDirection="row" wrap="wrap">
          {takeProfitStrategies().map((strategy) => (
            <StrategyCard key={strategy.rawData.name} {...strategy} />
          ))}
        </Flex>
      </Stack>
      <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
        <Image src="/images/moneyBag.svg" />
        <Flex alignItems="center">
          <Text textStyle="body">
            Set your profit taking goals when accumulating an asset, because when assets start pumping, euphoria kicks
            in.
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
        <Heading size="lg">Set up a smart swap strategy</Heading>
        <Text textStyle="body">
          The smartest way to enter and exit positions, complimented with pre- and post-swap automation to save time and
          counter emotional decision making.
        </Text>
      </Stack>

      <Strategies />
    </Stack>
  );
}

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
