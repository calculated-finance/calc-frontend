import React, { ReactNode, SVGProps } from 'react';
import {
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
  Spacer,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BarChartIcon,
  HomeIcon,
  SettingsIcon,
  Add1Icon,
  LifebeltIcon,
  ToolkitIcon,
} from '@fusion-icons/react/interface';
import Icon from '@components/Icon';
import CosmosWalletButton from '@components/CosmosWallet';
import Footer from '@components/Footer';

// based on linkitems href values
export enum Pages {
  Home = '/',
  Strategies = '/strategies/',
  CreateStrategy = '/create-strategy/',
  // Settings = '/settings/',
  HowItWorks = '/how-it-works/',
  // Performance = '/performance/',
}

interface LinkItem {
  name: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  active?: boolean;
  href: Pages;
}
const LinkItems: Array<LinkItem> = [
  { name: 'Home', icon: HomeIcon, href: Pages.Home },
  { name: 'Create strategy', icon: Add1Icon, href: Pages.CreateStrategy },
  { name: 'My strategies', icon: ToolkitIcon, href: Pages.Strategies },
  // { name: 'Performance', icon: BarChartIcon, href: Pages.Performance },
  { name: 'How it works', icon: LifebeltIcon, href: Pages.HowItWorks },
  // { name: 'Settings', icon: SettingsIcon, href: Pages.Settings },
];

export type ChildrenProp = {
  children: ReactNode;
};

const SIDEBAR_WIDTH = 64;

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface NavItemProps extends FlexProps {
  icon: LinkItem['icon'];
  isActive: boolean | undefined;
  href: LinkItem['href'];
}
function NavItem({ icon, children, isActive, href, ...rest }: NavItemProps) {
  return (
    <Link href={href}>
      <Flex
        align="center"
        p="4"
        pl={8}
        borderLeftWidth={2}
        borderColor={isActive ? 'brand.200' : 'transparent'}
        role="group"
        cursor="pointer"
        color={isActive ? 'brand.200' : '#D5F8F9'}
        _hover={{
          bg: 'navy',
          color: isActive ? 'brand.200' : 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="5"
            fontSize="16"
            stroke={isActive ? 'brand.200' : '#D5F8F9'}
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
      bg={useColorModeValue('white', 'abyss.200')}
      w={{ base: 'full', md: SIDEBAR_WIDTH }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="16" alignItems="center" mx="8" justifyContent="space-between">
        <Link href="/">
          <Image cursor="pointer" src="/images/logo.svg" />
        </Link>

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem href={link.href} isActive={link.href === router.asPath} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      <Stack position="absolute" p={6} bottom={0} color="grey.200" w="full" spacing={2}>
        <Footer />
      </Stack>
    </Flex>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
function MobileNav({ onOpen, ...rest }: MobileProps) {
  const router = useRouter();

  return (
    <Flex
      px={8}
      py={4}
      alignItems="center"
      bg={useColorModeValue('white', 'navy')}
      justifyContent="flex-start"
      flexDirection="column"
      {...rest}
    >
      <Flex w="full" pb={8} alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          <Image src="/images/logo.svg" />
        </Text>
        <Spacer />
        <CosmosWalletButton />
      </Flex>
      <Flex w="full" justifyContent="space-between">
        {LinkItems.map((link) => (
          <Link href={link.href} key={link.name}>
            <Icon
              as={link.icon}
              p={3}
              width={12}
              height={12}
              borderBottomWidth={2}
              borderColor={link.href === router.asPath ? 'brand.200' : 'transparent'}
              cursor="pointer"
              stroke={link.href === router.asPath ? 'brand.200' : '#D5F8F9'}
              _hover={{
                bg: 'darkGrey',
                stroke: link.href === router.asPath ? 'brand.200' : 'white',
              }}
            />
          </Link>
        ))}
      </Flex>
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
