import React, { ReactNode, ReactText } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Stack,
  LinkBox,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BarChartIcon,
  TwitterIcon,
  NightIcon,
  PaperplaneIcon,
  HomeIcon,
  SettingsIcon,
  MenuIcon,
  Add1Icon,
  LifebeltIcon,
  ToolkitIcon,
} from '@fusion-icons/react/interface';
import Icon from '@components/Icon';

interface LinkItemProps {
  name: string;
  icon: any;
  active?: boolean;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  {
    name: 'Home',
    icon: HomeIcon,
    active: true,
    href: '/',
  },
  { name: 'Create Strategy', icon: Add1Icon, href: '/create-strategy' },
  { name: 'My strategies', icon: ToolkitIcon, href: '/strategies' },
  { name: 'Performance', icon: BarChartIcon, href: '/performance' },
  { name: 'How it works', icon: LifebeltIcon, href: '/how-it-works' },
  { name: 'Settings', icon: SettingsIcon, href: '/settings' },
];

const SIDEBAR_WIDTH = 64;

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface NavItemProps extends FlexProps {
  icon: any;
  children: ReactText;
  isActive: boolean | undefined;
  href: string;
}
function NavItem({ icon, children, isActive, href, ...rest }: NavItemProps) {
  return (
    <Link href={href}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={isActive ? 'brand.200' : 'inherit'}
        _hover={{
          bg: 'navy',
          color: isActive ? 'brand.200' : 'white',
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      >
        {icon && (
          <Icon
            mr="5"
            fontSize="16"
            stroke={isActive ? 'brand.200' : 'white'}
            _groupHover={{
              stroke: isActive ? 'brand.200' : 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
}

function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const router = useRouter();

  return (
    <Flex
      bg={useColorModeValue('white', 'abyss')}
      w={{ base: 'full', md: SIDEBAR_WIDTH }}
      pos="fixed"
      h="full"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link href="/">
          <Image cursor="pointer" src="images/logo.svg" />
        </Link>

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem href={link.href} isActive={link.href === router.asPath} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      <Stack position="absolute" p={6} bottom={0} color="white" w="full" spacing={6}>
        <Stack color="gray.500" direction="row" w="full" spacing={8}>
          <LinkBox>
            <Icon as={TwitterIcon} />
          </LinkBox>
          <Icon as={PaperplaneIcon} />
          <Icon as={BarChartIcon} />
          <Icon as={NightIcon} />
        </Stack>
        <Text fontSize="xx-small">Proudly built on the Kujira Blockchain.</Text>
      </Stack>
    </Flex>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
function MobileNav({ onOpen, ...rest }: MobileProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'abyss')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<MenuIcon />} />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        <Image src="images/logo.svg" />
      </Text>
    </Flex>
  );
}
export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'navy')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: SIDEBAR_WIDTH }}>{children}</Box>
    </Box>
  );
}
