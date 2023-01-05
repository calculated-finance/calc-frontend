import { Button, Flex, Heading, Stack, Text, Image, Box, Badge, Spacer, Wrap, Spinner } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Icon from '@components/Icon';
import NextLink from 'next/link';
import {
  Code3Icon,
  Fullscreen1Icon,
  Fullscreen2Icon,
  GroundPlanIcon,
  HexagonSpiderWebIcon,
} from '@fusion-icons/react/interface';
import { useWallet } from '@wizard-ui/react';
import { ReactElement } from 'react';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { getSidebarLayout } from '../../components/Layout';
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
    name: 'Build a public basket of assets',
    description:
      'Choose your assets, select their percentage allocation and choose how you want to have the portfolio rebalanced. Others can buy into this portfolio and you can earn revenue based on performance fees.',
    advanced: true,
    href: StrategyUrls.BasketOfAssets,
    enabled: true,

    icon: <Icon stroke="brand.200" strokeWidth={2} as={GroundPlanIcon} width={8} height={8} />,
    learnMoreHref: 'https://calculated.fi/algorithm-dca-in',
  },
  {
    name: 'Build a private basket of assets',
    description:
      'Choose your assets, select their percentage allocation and choose how you want to have the portfolio rebalanced. Only your wallet address can access this portfolio.',
    icon: <Icon stroke="brand.200" strokeWidth={2} as={HexagonSpiderWebIcon} width={8} height={8} />,
    learnMoreHref: 'https://calculated.fi/standard-dca-in',
  },
];

function StrategyCard({ name, description, advanced, icon, href, learnMoreHref, enabled }: StrategyCardProps) {
  return (
    <Stack
      direction={['row', null, null, 'row']}
      p={4}
      layerStyle="panel"
      width={['full', null, null, null, 500]}
      gap={4}
    >
      <Flex direction="column" flexGrow={1}>
        <Flex mb={4}>{icon}</Flex>
        <Heading size="md" mb={2}>
          {name}
        </Heading>
        <Text textStyle="body-xs">{description}</Text>
      </Flex>
      <Flex justifyContent="center" direction="column" alignContent="center">
        {enabled ? (
          <NextLink href={href ?? '#'}>
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

function Strategies() {
  const { data, isLoading } = useQueryWithNotification(['fear-and-greed-index'], async () => {
    const response = await fetch(`https://api.alternative.me/fng/`);
    if (!response.ok) {
      throw new Error('Failed to fetch fear and greed index.');
    }
    return response.json();
  });

  return (
    <Stack direction="column" spacing={8}>
      <Box>
        <Heading size="md">Build your own asset management portfolio with rebalancing automatically built in</Heading>

        <Text pb={4} textStyle="body">
          Diversify your investments to manage risk and potentially earn revenue by sharing and managing an investment
          portfolio with others.
        </Text>
        <Flex gap={8} flexDirection="row" wrap="wrap">
          {accumulationStratgies.map((strategy) => (
            <StrategyCard key={strategy.name} {...strategy} />
          ))}
        </Flex>
      </Box>

      <Stack direction="row" layerStyle="panel" p={4} spacing={4}>
        <Image src="/images/abacus.svg" />
        <Flex alignItems="center">
          <Text textStyle="body">
            Diversification can help to spread risk and potentially improve returns. By investing in a variety of
            cryptocurrencies, you can potentially mitigate the impact of any one coin&apos;s performance on your overall
            portfolio. Additionally, a crypto portfolio can offer exposure to a wider range of opportunities within the
            cryptocurrency market. This can provide a greater potential for growth and income, as you are not solely
            reliant on the success of a single asset.
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
        <Heading size="lg">Set up a new asset management strategy</Heading>
      </Stack>

      <Strategies />
    </Stack>
  );
}

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
