import {
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  Icon,
  Image,
  Button,
  MenuItemOption,
  Tooltip,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useChainId } from '@hooks/useChainId';
import { ChainId } from '@models/ChainId';
import { useRouter } from 'next/router';

const chainSelectionAllowedUrls = [
  '/',
  '/create-strategy',
  '/stats-and-totals',
  '/bridge-assets',
  '/how-it-works',
  '/learn-about-calc',
  '/experimental-features',
  '/create-strategy/streaming-swap/assets',
];

const imageMap = {
  'osmosis-1': '/images/denoms/osmo.svg',
  'osmo-test-5': '/images/denoms/osmo.svg',
  'kaiyo-1': '/images/denoms/kuji.svg',
  'harpoon-4': '/images/denoms/kuji.svg',
  'archway-1': '/images/denoms/archway.svg',
  'constantine-3': '/images/denoms/archway.svg',
  'neutron-1': '/images/denoms/neutron.svg',
  'pion-1': '/images/denoms/neutron.svg',
};

export function ChainSelection() {
  const { isOpen, onClose } = useDisclosure();
  const { chainId, setChain } = useChainId();
  const router = useRouter();

  const chains = [
    { id: 'kaiyo-1', name: 'Kujira', imageSrc: '/images/denoms/kuji.svg', isTestnet: false },
    { id: 'osmosis-1', name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg', isTestnet: false },
    ...(process.env.NEXT_PUBLIC_APP_ENV === 'production'
      ? []
      : [
          { id: 'archway-1', name: 'Archway', imageSrc: '/images/denoms/archway.svg', isTestnet: false },
          { id: 'neutron-1', name: 'Neutron', imageSrc: '/images/denoms/neutron.svg', isTestnet: false },
        ]),
    { id: 'harpoon-4', name: 'Kujira', imageSrc: '/images/denoms/kuji.svg', isTestnet: true },
    { id: 'osmo-test-5', name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg', isTestnet: true },
    { id: 'constantine-3', name: 'Archway', imageSrc: '/images/denoms/archway.svg', isTestnet: true },
    { id: 'pion-1', name: 'Neutron', imageSrc: '/images/denoms/neutron.svg', isTestnet: true },
  ];

  const isChainSelectionAllowed = chainSelectionAllowedUrls.includes(router.pathname);

  return (
    <Menu>
      {isChainSelectionAllowed && (
        <MenuButton
          as={Button}
          variant="ghost"
          rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}
        >
          <Image src={imageMap[chainId]} w={5} />
        </MenuButton>
      )}
      <MenuList fontSize="sm">
        {chains
          .filter((chain) => !chain.isTestnet || process.env.NEXT_PUBLIC_APP_ENV !== 'production')
          .map((chain) => (
            <MenuItemOption
              key={chain.id}
              _checked={{ bg: 'blue.500', color: 'navy' }}
              isChecked={chainId === chain.id}
              onClick={() => {
                setChain(chain.id as ChainId);
                onClose();
              }}
            >
              <HStack>
                <Image src={chain.imageSrc} w={5} />
                <Text>
                  {chain.name}
                  {chain.isTestnet ? ' (testnet)' : ''}
                </Text>
              </HStack>
            </MenuItemOption>
          ))}
      </MenuList>
    </Menu>
  );
}
