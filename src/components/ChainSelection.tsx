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
  Flex,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useChainId } from '@hooks/useChainId';
import { ChainId } from '@models/ChainId';
import { useRouter } from 'next/router';

export function ChainCards({ onChainSelect }: { onChainSelect: (chain: ChainId) => void }) {
  const mainnetChains = [
    { id: 'kaiyo-1', name: 'Kujira', imageSrc: '/images/denoms/kuji.svg' },
    { id: 'osmosis-1', name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg' },
  ];

  const testnetChains = [
    { id: 'harpoon-4', name: 'Kujira Testnet', imageSrc: '/images/denoms/kuji.svg' },
    { id: 'osmo-test-5', name: 'Osmosis testnet', imageSrc: '/images/denoms/osmo.svg' },
  ];

  return (
    <Wrap justify="center">
      {[...mainnetChains, ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? [] : testnetChains)].map((chain) => (
        <WrapItem>
          <Flex
            alignItems="center"
            justifyContent="center"
            key={chain.id}
            w={32}
            h={32}
            p={2}
            bg="abyss.200"
            borderRadius="md"
            cursor="pointer"
            onClick={() => onChainSelect(chain.id as ChainId)}
            _hover={{
              borderWidth: 1,
              borderColor: 'blue.200',
            }}
          >
            <Flex direction="column" align="center">
              <Image src={chain.imageSrc} w={10} />
              <Text mt={2} fontSize="sm">
                {chain.name}
              </Text>
            </Flex>
          </Flex>
        </WrapItem>
      ))}
    </Wrap>
  );
}

const chainSelectionAllowedUrls = [
  '/',
  '/strategies',
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
  'constantine-3': '/images/denoms/archway.svg',
};

export function ChainSelection() {
  const { isOpen, onClose } = useDisclosure();
  const { chainId, setChain } = useChainId();
  const router = useRouter();

  const chains = [
    { id: 'kaiyo-1', name: 'Kujira', imageSrc: '/images/denoms/kuji.svg', isTestnet: false },
    { id: 'osmosis-1', name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg', isTestnet: false },
    { id: 'harpoon-4', name: 'Kujira', imageSrc: '/images/denoms/kuji.svg', isTestnet: true },
    { id: 'osmo-test-5', name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg', isTestnet: true },
    { id: 'constantine-3', name: 'Archway', imageSrc: '/images/denoms/archway.svg', isTestnet: true },
  ];

  const isChainSelectionAllowed = chainSelectionAllowedUrls.includes(router.pathname);

  return (
    <Menu>
      <Tooltip label={!isChainSelectionAllowed && 'You cannot change chain on this page'} aria-label="Select chain">
        <MenuButton
          as={Button}
          disabled={!isChainSelectionAllowed}
          variant="ghost"
          rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}
          isDisabled={!isChainSelectionAllowed}
        >
          <Image src={imageMap[chainId]} w={5} />
        </MenuButton>
      </Tooltip>
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
