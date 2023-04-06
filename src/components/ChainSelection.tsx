import { useDisclosure, Menu, MenuButton, MenuList, Icon, Button, MenuItemOption } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Chains, useChain } from '@hooks/useChain';

export function ChainSelection() {
  const { isOpen, onClose } = useDisclosure();

  const { chain, setChain } = useChain((state) => ({
    chain: state.chain,
    setChain: state.setChain,
  }));

  return (
    <Menu>
      <MenuButton>
        <Button variant="outline" rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}>
          {chain}
        </Button>
      </MenuButton>
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
