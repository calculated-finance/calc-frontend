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
import { useRouter } from 'next/router';
import {
  HomeIcon,
  Add1Icon,
  ToolkitIcon,
  BoxedImportIcon,
  Graph2Icon,
  ViewListIcon,
} from '@fusion-icons/react/interface';
import Icon from '@components/Icon';
import Footer from '@components/Footer';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { SidebarControls } from '@components/Layout/SidebarControls';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { useAdmin } from '@hooks/useAdmin';
import LinkWithQuery from '@components/LinkWithQuery';
import { Pages } from './Pages';

interface LinkItem {
  name: string;
  icon: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | ComponentWithAs<'svg', IconProps>;
  active?: boolean;
  href: Pages;
  exclude?: Chains[];
}
const LinkItems: Array<LinkItem> = [
  { name: 'Home', icon: HomeIcon, href: Pages.Home },
  { name: 'Create strategy', icon: Add1Icon, href: Pages.CreateStrategy },
  { name: 'My strategies', icon: ToolkitIcon, href: Pages.Strategies },
  { name: 'Bridge assets', icon: BoxedImportIcon, href: Pages.GetAssets },
  // { name: 'Performance', icon: BarChartIcon, href: Pages.Performance },
  { name: 'How it works', icon: QuestionOutlineIcon, href: Pages.HowItWorks, exclude: [Chains.Osmosis] },
  // { name: 'Settings', icon: SettingsIcon, href: Pages.Settings },
];

const getLinkItems = (isAdmin: boolean) => [
  ...LinkItems,
  ...(isAdmin
    ? [
        { name: 'Stats & totals', icon: Graph2Icon, href: Pages.StatsAndTotals },
        { name: 'All strategies', icon: ViewListIcon, href: Pages.AllStrategies },
      ]
    : []),
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
    <LinkWithQuery href={href}>
      <Flex
        align="center"
        p="4"
        pl={8}
        borderLeftWidth={2}
        borderColor={isActive ? 'brand.200' : 'transparent'}
        role="group"
        cursor="pointer"
        color={isActive ? 'brand.200' : 'blue.200'}
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
            stroke={isActive ? 'brand.200' : 'blue.200'}
            _groupHover={{
              stroke: isActive ? 'brand.200' : 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </LinkWithQuery>
  );
}

const sidebarLogoUrls = {
  [Chains.Osmosis]: '/images/osmoMascot.svg',
  [Chains.Kujira]: '/images/kujiMascot.svg',
  [Chains.Moonbeam]: '/images/moonbeam-large.png',
};

function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const router = useRouter();
  const { chain } = useChain();
  const { isAdmin } = useAdmin();

  return (
    <Flex
      bg={useColorModeValue('white', 'abyss.200')}
      w={{ base: 'full', md: SIDEBAR_WIDTH }}
      pos="fixed"
      h="full"
      boxShadow="inset -4px 0 5px -4px rgba(18, 18, 19, 0.6)"
      bgImage={sidebarLogoUrls[chain]}
      bgPosition="bottom"
      bgSize="contain"
      bgRepeat="no-repeat"
      {...rest}
    >
      <Flex h="16" alignItems="center" mx="8" justifyContent="space-between">
        <LinkWithQuery href="/">
          {chain === Chains.Osmosis ? (
            <Image cursor="pointer" src="/images/osmoLogo.svg" w={105} />
          ) : (
            <Image cursor="pointer" src="/images/logo.svg" w={105} />
          )}
        </LinkWithQuery>

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box backdropFilter="auto" backdropBlur="3px">
        {getLinkItems(isAdmin)
          .filter((link) => !link.exclude?.includes(chain))
          .map((link) => (
            <NavItem href={link.href} isActive={link.href === router.route} key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          ))}
      </Box>
      <Stack
        position="absolute"
        p={6}
        bottom={0}
        color="grey.200"
        w="full"
        spacing={2}
        backdropFilter="auto"
        backdropBlur="3px"
      >
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
  const { chain } = useChain();
  const { isAdmin } = useAdmin();

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
          {chain === Chains.Osmosis ? (
            <Image src="/images/osmoLogo.svg" w={105} />
          ) : (
            <Image src="/images/logo.svg" w={105} />
          )}
        </Text>
        <Spacer />
        <SidebarControls />
      </Flex>
      <Flex w="full" justifyContent="space-between">
        {getLinkItems(isAdmin)
          .filter((link) => !link.exclude?.includes(chain))
          .map((link) => (
            <LinkWithQuery href={link.href} key={link.name}>
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
            </LinkWithQuery>
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
