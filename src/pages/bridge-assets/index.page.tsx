import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  SimpleGrid,
  Modal,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';
import 'isomorphic-fetch';
import OnRampModal, { OnRampModalContent } from '../../components/OnRampModalContent';

type GetAssetsCardProps = {
  name: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  onClick?: () => void;
};

const bridges: GetAssetsCardProps[] = [
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
    description: 'Get axlUSDC from a fiat on ramp provider.',
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

function GetAssetsCard({ name, description, image, href, cta, onClick }: GetAssetsCardProps) {
  return (
    <Flex direction="column" p={8} layerStyle="panel" width="full" align="start">
      <Image h={14} src={image} mb={6} />
      <Stack direction="column" flexGrow={1} align="start" mb={6}>
        <Heading size="md">{name}</Heading>
        <Text textStyle="body">{description}</Text>
      </Stack>
      {onClick ? (
        <Button onClick={onClick} w="full">
          {cta}
        </Button>
      ) : (
        <Button as="a" target="_blank" rel="noopener noreferrer" href={href} w="full">
          {cta}
        </Button>
      )}
    </Flex>
  );
}

function Strategies() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Stack direction="column" spacing={8}>
      <SimpleGrid columns={[1, null, null, 2, null, 4]} gap={8}>
        <GetAssetsCard
          name="Cross Chain Bridge"
          description="Move assets from non Cosmos chains like Ethereum."
          image="/images/axelar.svg"
          href="https://blue.kujira.app/bridge"
          cta="Bridge now"
        />
        <GetAssetsCard
          name="IBC Bridge"
          description="Move assets from Cosmos SDK chains like Terra or Juno."
          image="/images/cosmos.svg"
          href="https://blue.kujira.app/ibc"
          cta="Bridge now"
        />
        <GetAssetsCard
          name="Fiat on ramp"
          description="Get axlUSDC from a fiat on ramp provider."
          image="/images/kado.svg"
          href="https://www.kado.money/assets/usd-coin"
          onClick={onOpen}
          cta="Get axlUSDC now"
        />
        <GetAssetsCard
          name="Mint USK"
          description="Use ATOM or DOT as collateral to mint the USK stablecoin."
          image="/images/mintUsk.svg"
          href="https://blue.kujira.app/mint"
          cta="Mint USK now"
        />
      </SimpleGrid>
      <OnRampModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
}

function BridgeAssets() {
  return (
    <Stack direction="column" spacing={8}>
      <Stack spacing={2}>
        <Heading size="lg">Bridge Assets</Heading>
        <Text textStyle="body">Use any of these tools to get funds before you set up a CALC strategy!</Text>
      </Stack>

      <Strategies />
    </Stack>
  );
}

BridgeAssets.getLayout = getSidebarLayout;

export default BridgeAssets;
