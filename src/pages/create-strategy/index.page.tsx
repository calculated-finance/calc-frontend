import { Button, Flex, Heading, Link, Stack, Text, Image, Box, Badge, Spacer, HStack, Wrap } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Icon from '@components/Icon';
import NextLink from 'next/link';
import {
  Code3Icon,
  DonateIcon,
  Fullscreen1Icon,
  Fullscreen2Icon,
  Graph1Icon,
  PuzzleIcon,
} from '@fusion-icons/react/interface';
import { useWallet } from '@wizard-ui/react';
import { SVGProps } from 'react';
import { getSidebarLayout } from '../../components/Layout';
import StrategyUrls from './StrategyUrls';

type StrategyCardProps = {
  name: string;
  description: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  enabled?: boolean;
  href?: StrategyUrls;
  advanced?: boolean;
  linkToInfo?: string;
};

const accumulationStratgies: StrategyCardProps[] = [
  {
    name: 'Standard DCA In',
    description: 'Dollar-cost Average into an asset with ease.',
    icon: Fullscreen2Icon,
    enabled: true,
    href: StrategyUrls.DCAIn,
  },
  {
    name: 'Advanced DCA+',
    description: 'Let our advanced DCA algorithms invest for you.',
    advanced: true,
    icon: Code3Icon,
  },
  {
    name: 'Buy the Dip',
    description: 'Auto-buy after a specified % dip in your favourite asset.',
    advanced: true,
    icon: Graph1Icon,
  },
];

const takeProfitStrategies: StrategyCardProps[] = [
  {
    name: 'Standard DCA Out',
    description: 'Dollar-cost Average out of an asset with ease.',
    icon: Fullscreen1Icon,
    enabled: true,
    href: StrategyUrls.DCAOut,
  },
  {
    name: 'Auto-take profit',
    description: 'Sell a certain % of an asset after it pumps a certain %',
    advanced: true,
    icon: DonateIcon,
    enabled: false,
  },
];

function InfoPanel(): JSX.Element {
  return (
    <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
      <Image src="/images/iceblock.svg" />
      <Flex alignItems="center">
        <Text fontSize="sm">
          <Text as="span" fontWeight="bold">
            Dollar-cost averaging
          </Text>{' '}
          is one of the easiest techniques to reduce the volatility risk of investing in crypto, and it&apos;s a great
          way to practice buy-and-hold investing over a few cycles.
        </Text>
      </Flex>
    </Stack>
  );
}

function StrategyCard({ name, description, advanced, icon, href, linkToInfo, enabled }: StrategyCardProps) {
  return (
    <Stack direction={['row', null, null, 'column']} p={4} layerStyle="panel" width={['full', null, null, 56]} gap={4}>
      <Flex direction="column" flexGrow={1}>
        <Flex mb={4}>
          <Icon stroke="brand.200" as={icon} width={8} height={8} />
          <Spacer />
          <Box>
            <Badge size="xs" colorScheme={advanced ? 'orange' : 'blue'}>
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
          <NextLink href={href ?? '/'}>
            <Button mb={2}>Get started</Button>
          </NextLink>
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

StrategyCard.defaultProps = {
  enabled: false,
  href: undefined,
  advanced: false,
  linkToInfo: undefined,
};

function Strategies() {
  return (
    <Stack direction="column" spacing={8}>
      <Box>
        <Wrap spacing={2} pb={1} shouldWrapChildren>
          <Heading size="md">Accumulation strategies</Heading>
          <Badge colorScheme="green" whiteSpace="normal" textAlign="center">
            According to the{' '}
            <NextLink passHref href="https://alternative.me/crypto/fear-and-greed-index/">
              <Text as="a" textDecoration="underline" target="_blank">
                Fear &amp; Greed index score
              </Text>
            </NextLink>
            {/* TODO: make this value based on the api */}: 22, it&apos;s a good time to use accumulation strategies
          </Badge>
        </Wrap>
        <Text color="grey.200">You want to build a position in an asset. </Text>
      </Box>
      <Flex gap={8} flexDirection="row" wrap="wrap">
        {accumulationStratgies.map((strategy) => (
          <StrategyCard key={strategy.name} {...strategy} />
        ))}
      </Flex>
      <InfoPanel />
      <Box>
        <Heading mb={2} size="md">
          Take profit strategies
        </Heading>
        <Text color="grey.200">You want to start selling assets because you have a good return on them already.</Text>
      </Box>
      <Flex gap={8} flexDirection="row" wrap="wrap">
        {takeProfitStrategies.map((strategy) => (
          <StrategyCard key={strategy.name} {...strategy} />
        ))}
      </Flex>
      <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
        <Image src="/images/moneyBag.svg" />
        <Flex alignItems="center">
          <Text fontSize="sm" fontWeight="bold">
            If you can learn anything from the Luna crash, it&apos;s don&apos;t marry your bags. Always be objective and
            if you don&apos;t take your profits, then someone else will.
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
}

function CreateStrategy() {
  const { address } = useWallet();

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
          <ConnectWallet layerStyle="panel" />
          <InfoPanel />
        </>
      )}
    </Stack>
  );
}

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
