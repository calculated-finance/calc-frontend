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
import { useChain } from '@hooks/useChain';
import { ChainId } from '@hooks/useChain/Chains';
import { useRouter } from 'next/router';

export function ChainCards({ onChainSelect }: { onChainSelect: (chain: ChainId) => void }) {
  const chains = [
    { id: 'kaiyo-1', name: 'Kujira', imageSrc: '/images/denoms/kuji.svg' },
    { id: 'osmosis-1', name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg' },
    { id: 'harpoon-4', name: 'Kujira Testnet', imageSrc: '/images/denoms/kuji.svg' },
    { id: 'osmo-test-5', name: 'Osmosis testnet', imageSrc: '/images/denoms/osmo.svg' },
  ];

  return (
    <Wrap justify="center">
      {chains.map((chain) => (
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
];

const imageMap = {
  'osmosis-1': '/images/denoms/osmo.svg',
  'osmo-test-5': '/images/denoms/osmo.svg',
  'kaiyo-1': '/images/denoms/kuji.svg',
  'harpoon-4': '/images/moonbeam.png',
};

export function ChainSelection() {
  const { isOpen, onClose } = useDisclosure();

  const { chain, setChain } = useChain();

  const router = useRouter();

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
          <Image src={imageMap[chain]} w={5} />
        </MenuButton>
      </Tooltip>
      <MenuList fontSize="sm">
        <MenuItemOption
          _checked={{ bg: 'blue.500', color: 'navy' }}
          isChecked={chain === 'kaiyo-1'}
          onClick={() => {
            setChain('kaiyo-1');
            onClose();
          }}
        >
          <HStack>
            <Image src="/images/denoms/kuji.svg" w={5} />
            <Text>Kujira</Text>
          </HStack>
        </MenuItemOption>
        <MenuItemOption
          _checked={{ bg: 'blue.500', color: 'navy' }}
          isChecked={chain === 'osmosis-1'}
          onClick={() => {
            setChain('osmosis-1');
            onClose();
          }}
        >
          <HStack>
            <Image src="/images/denoms/osmo.svg" w={5} />
            <Text>Osmosis</Text>
          </HStack>
        </MenuItemOption>
        {/* {chain === Chains.Moonbeam && (
          <MenuItemOption
            _checked={{ bg: 'blue.500', color: 'navy' }}
            isChecked={chain === Chains.Moonbeam}
            onClick={() => {
              setChain(Chains.Moonbeam);
              onClose();
            }}
          >
            <HStack>
              <Image src="/images/moonbeam.png" w={5} />
              <Text>Moonbeam</Text>
            </HStack>
          </MenuItemOption>
        )} */}
      </MenuList>
    </Menu>
  );
}
