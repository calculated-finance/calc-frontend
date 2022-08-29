import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Stack,
  Spacer,
  LinkBox,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiSettings,
  FiMenu,
  FiInfo,
  FiBarChart,
  FiBriefcase,
  FiPlusSquare,
  FiTwitter,
  FiMail,
  FiMoon,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LinkItemProps {
  name: string;
  icon: IconType;
  active?: boolean;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, active: true, href: '/' },
  { name: 'Create Strategy', icon: FiPlusSquare, href: '/create-strategy' },
  { name: 'My strategies', icon: FiBriefcase, href: '/strategies' },
  { name: 'Performance', icon: FiBarChart, href: '/performance' },
  { name: 'How it works', icon: FiInfo, href: '/how-it-works' },
  { name: 'Settings', icon: FiSettings, href: '/settings' },
];

const SIDEBAR_WIDTH = 64;

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>

      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: SIDEBAR_WIDTH }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter()

  return (
    <Flex
      bg={useColorModeValue('white', 'gray.900')}
      w={{ base: 'full', md: SIDEBAR_WIDTH }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" >
        <Link href="/"><Image cursor={'pointer'} src="images/logo.svg" /></Link>

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {
        LinkItems.map((link) => (
          <NavItem href={link.href} isActive={link.href === router.asPath} key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        ))
      }
      <Stack position='absolute' p={6} bottom={0} color='white' w='full' spacing={6}>
        <Stack color="gray.500" direction={'row'} w='full' spacing={8}>
          <LinkBox>
            <Icon as={FiTwitter} />
          </LinkBox>
          <Icon as={FiMail} />
          <Icon as={FiBarChart} />
          <Icon as={FiMoon} />
        </Stack>
        <Text fontSize="xx-small">
          Proudly built on the Kujira Blockchain.
        </Text>
      </Stack >
    </Flex >
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  isActive: boolean | undefined;
  href: string;
}
const NavItem = ({ icon, children, isActive, href, ...rest }: NavItemProps) => {
  return (
    <Link href={href}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={isActive ? 'yellow.500' : 'inherit'}
        _hover={{
          bg: 'gray.700',
          color: isActive ? 'yellow.500' : 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="5"
            fontSize="16"
            _groupHover={{
              color: isActive ? 'yellow.500' : 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />} />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        <Image src="images/logo.svg" />
      </Text>
    </Flex>
  );
};