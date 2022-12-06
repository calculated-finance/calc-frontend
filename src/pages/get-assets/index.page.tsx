import { Button, Flex, Heading, Stack, Text, Image, Link, SimpleGrid } from '@chakra-ui/react';
import Icon from '@components/Icon';
import NextLink from 'next/link';
import { Code3Icon, Fullscreen1Icon, Fullscreen2Icon } from '@fusion-icons/react/interface';
import { ReactElement } from 'react';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { getSidebarLayout } from '../../components/Layout';
import 'isomorphic-fetch';
import StrategyUrls from '../create-strategy/StrategyUrls';

type GetAssetsCardProps = {
  name: string;
  description: string;
  image: string;
  href: string;
  cta: string;
};

const accumulationStratgies: GetAssetsCardProps[] = [
  {
    name: 'Cross Chain Bridge',
    description: 'Move assets from non Cosmos chains like Ethereum.',
    image: '/images/axelar.svg',
    href: 'https://blue.kujira.app/bridge',
    cta: 'Bridge now',
  },
  {
    name: 'IBC Bridge',
    description: 'Move assets from Cosmos SDK chains like Terra or Juno.',
    image: '/images/cosmos.svg',
    href: 'https://blue.kujira.app/ibc',
    cta: 'Bridge now',
  },
  {
    name: 'Fiat on ramp',
    description: 'Get USDC from a fiat on ramp provider.',
    image: '/images/kado.svg',
    href: 'https://www.kado.money/assets/usd-coin',
    cta: 'Get axlUSDC now',
  },
  {
    name: 'Mint USK',
    description: 'Use ATOM or DOT as collateral to mint the USK stablecoin.',
    image: '/images/mintUsk.svg',
    href: 'https://blue.kujira.app/mint',
    cta: 'Mint USK now',
  },
];

function GetAssetsCard({ name, description, image, href, cta }: GetAssetsCardProps) {
  return (
    <Flex direction="column" p={8} layerStyle="panel" width="full" align="start">
      <Image h={14} src={image} mb={6} />
      <Stack direction="column" flexGrow={1} align="start" mb={6}>
        <Heading size="md">{name}</Heading>
        <Text textStyle="body">{description}</Text>
      </Stack>
      <Button as="a" target="_blank" rel="noopener noreferrer" href={href} w="full">
        {cta}
      </Button>
    </Flex>
  );
}

function Strategies() {
  return (
    <Stack direction="column" spacing={8}>
      <SimpleGrid columns={[1, null, null, 2, null, 4]} gap={8}>
        {accumulationStratgies.map((strategy) => (
          <GetAssetsCard key={strategy.name} {...strategy} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

function CreateStrategy() {
  return (
    <Stack direction="column" spacing={8}>
      <Stack spacing={2}>
        <Heading size="lg">Get Funds</Heading>
        <Text textStyle="body">Use these protocols to get more assets to invest.</Text>
      </Stack>

      <Strategies />
    </Stack>
  );
}

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
