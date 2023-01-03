import { ReactNode, SVGProps } from 'react';
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
  IconButton,
  ComponentWithAs,
  IconProps,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, Add1Icon, ToolkitIcon, BoxedImportIcon } from '@fusion-icons/react/interface';
import Icon from '@components/Icon';
import CosmosWalletButton from '@components/CosmosWallet';
import Footer from '@components/Footer';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import Banner from '@components/Banner';
import { featureFlags } from 'src/constants';
import { Pages } from './Pages';

interface LinkItem {
  name: string;
  icon: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | ComponentWithAs<'svg', IconProps>;
  active?: boolean;
  href: Pages;
}
const LinkItems: Array<LinkItem> = [
  { name: 'Home', icon: HomeIcon, href: Pages.Home },
  { name: 'Create strategy', icon: Add1Icon, href: Pages.CreateStrategy },
  { name: 'Create basket', icon: Add1Icon, href: Pages.CreatePortfolio },
  { name: 'My strategies', icon: ToolkitIcon, href: Pages.Strategies },
  { name: 'Bridge assets', icon: BoxedImportIcon, href: Pages.GetAssets },
  // { name: 'Performance', icon: BarChartIcon, href: Pages.Performance },
  { name: 'How it works', icon: QuestionOutlineIcon, href: Pages.HowItWorks },
  // { name: 'Settings', icon: SettingsIcon, href: Pages.Settings },
];

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
          boxShadow: 'inset -4px 0 5px -4px rgba(18, 18, 19, 0.6)',

          color: isActive ? 'brand.200' : 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="5"
            width="16px"
            height="16px"
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
      boxShadow="inset -4px 0 5px -4px rgba(18, 18, 19, 0.6)"
      {...rest}
    >
      <Flex h="16" alignItems="center" mx="8" justifyContent="space-between">
        <Link href="/">
          <Image
            h={6}
            cursor="pointer"
            src={featureFlags.festiveLogoEnabled ? '/images/festiveLogo.svg' : '/images/logo.svg'}
          />
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
          <Image h={6} src={featureFlags.festiveLogoEnabled ? '/images/festiveLogo.svg' : '/images/logo.svg'} />
        </Text>
        <Spacer />
        <CosmosWalletButton />
      </Flex>
      <Flex w="full" justifyContent="space-between">
        {LinkItems.map((link) => (
          <Link href={link.href} key={link.name}>
            <IconButton
              aria-label={link.name}
              variant="link"
              width={12}
              height={12}
              p={0}
              borderBottomWidth={2}
              borderColor={link.href === router.asPath ? 'brand.200' : 'transparent'}
              borderRadius="none"
              _hover={{
                bg: 'darkGrey',
                stroke: link.href === router.asPath ? 'brand.200' : 'white',
              }}
              icon={
                <Icon
                  as={link.icon}
                  cursor="pointer"
                  color={link.href === router.asPath ? 'brand.200' : '#D5F8F9'}
                  stroke={link.href === router.asPath ? 'brand.200' : '#D5F8F9'}
                />
              }
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
      <Banner />
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
