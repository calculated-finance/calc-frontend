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
  Box,
  Flex,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { useRouter } from 'next/router';


export function ChainCards({onChainSelect}: { onChainSelect: (chain: Chains) => void }) {
  const chains = [
    { id: Chains.Kujira, name: 'Kujira', imageSrc: '/images/denoms/kuji.svg' },
    { id: Chains.Osmosis, name: 'Osmosis', imageSrc: '/images/denoms/osmo.svg' },
  ];

  return (

      <Wrap justify="center" >
        {chains.map((chain) => (
          <WrapItem>
            <Flex alignItems="center" justifyContent="center"
              key={chain.id}
              w={32}
              h={32}
              p={2}
              bg="abyss.200"
              borderRadius="md"
              cursor="pointer"
              onClick={() => onChainSelect(chain.id)}
              _hover={{
                borderWidth:1,
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
  '/experimental-features',
];

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
          {chain === Chains.Osmosis ? (
            <Image src="/images/denoms/osmo.svg" w={5} />
          ) : (
            <Image src="/images/denoms/kuji.svg" w={5} />
          )}
        </MenuButton>
      </Tooltip>
      <MenuList fontSize="sm">
        <MenuItemOption
          _checked={{ bg: 'blue.500', color: 'navy' }}
          isChecked={chain === Chains.Kujira}
          onClick={() => {
            setChain(Chains.Kujira);
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
          isChecked={chain === Chains.Osmosis}
          onClick={() => {
            setChain(Chains.Osmosis);
            onClose();
          }}
        >
          <HStack>
            <Image src="/images/denoms/osmo.svg" w={5} />
            <Text>Osmosis</Text>
          </HStack>
        </MenuItemOption>
      </MenuList>
    </Menu>
  );
}
