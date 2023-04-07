import { useDisclosure, Menu, MenuButton, MenuList, Icon, Button, MenuItemOption, Tooltip } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Chains, useChain } from '@hooks/useChain';
import { useRouter } from 'next/router';

const chainSelectionAllowedUrls = [
  '/',
  '/strategies',
  '/create-strategy',
  '/stats-and-totals',
  '/bridge-assets',
  '/how-it-works',
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
          variant="outline"
          rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}
          isDisabled={!isChainSelectionAllowed}
        >
          {chain}
        </MenuButton>
      </Tooltip>
      <MenuList fontSize="sm">
        <MenuItemOption
          isChecked={chain === Chains.Kujira}
          onClick={() => {
            setChain(Chains.Kujira);
            onClose();
          }}
        >
          Kujira
        </MenuItemOption>
        <MenuItemOption
          isChecked={chain === Chains.Osmosis}
          onClick={() => {
            setChain(Chains.Osmosis);
            onClose();
          }}
        >
          Osmosis
        </MenuItemOption>
      </MenuList>
    </Menu>
  );
}
