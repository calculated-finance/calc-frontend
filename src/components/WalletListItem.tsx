import { Center, Spacer, Image } from '@chakra-ui/react';

export interface WalletListItemProps {
  handleClick: () => void;
  icon: string;
  name: string;
  isInstalled: boolean;
  walletInstallLink: string;
}

export function WalletListItem({ handleClick, icon, name, isInstalled, walletInstallLink }: WalletListItemProps) {
  return (
    <Center
      as={isInstalled ? undefined : 'a'}
      onClick={isInstalled ? handleClick : undefined}
      w="full"
      bg="deepHorizon"
      p={2}
      px={3}
      borderRadius="xl"
      borderColor="slateGrey"
      borderWidth={1}
      _hover={{ bg: 'abyss.200' }}
      cursor="pointer"
      href={walletInstallLink}
      target={isInstalled ? undefined : '_blank'}
      rel={isInstalled ? undefined : 'noopener noreferrer'}
    >
      <Image w={4} mr={2} src={icon} alt={`${name} icon`} />
      <div>{name}</div>
      <Spacer />
      <p>{isInstalled ? 'Installed' : 'Click to install'}</p>
    </Center>
  );
}
