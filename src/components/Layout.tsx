import { Box, Flex, Spacer, Image, BoxProps, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useWallet } from '@hooks/useWallet';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import usePageLoad from '@hooks/usePageLoad';
import { useRouter } from 'next/router';
import { Graph2Icon, ViewListIcon } from '@fusion-icons/react/interface';
import { useAdmin } from '@hooks/useAdmin';
import { useChainId } from '@hooks/useChainId';
import { ModalWrapper } from '@components/ModalWrapper';
import LinkWithQuery from '@components/LinkWithQuery';
import { AssetPageStrategyButtons } from '@components/AssetsPageAndForm/AssetPageStrategyButtons';
import { isStepOne } from '@helpers/isStepOne';
import { OSMOSIS_CHAINS } from 'src/constants';
import Sidebar from './Sidebar';
import { AppHeaderActions } from './AppHeaderActions';
import { LinkItem, LinkItems } from './LinkItems';
import { Pages } from '../pages/Pages';

const HEADER_HEIGHT = '64px';

function AppHeaderForSidebar() {
  return (
    <Flex
      h={HEADER_HEIGHT}
      w="full"
      p={8}
      justifyContent="end"
      alignItems="center"
      display={{ base: 'none', md: 'flex' }}
    >
      <AppHeaderActions />
    </Flex>
  );
}

function AppHeader() {
  const { chainId: chain } = useChainId();
  return (
    <Flex position="absolute" h={HEADER_HEIGHT} w="full" p={8} alignItems="center">
      <LinkWithQuery href="/">
        {OSMOSIS_CHAINS.includes(chain) ? (
          <Image cursor="pointer" src="/images/osmoLogo.svg" w={105} />
        ) : (
          <Image cursor="pointer" src="/images/logo.svg" w={105} />
        )}
      </LinkWithQuery>
      <Spacer />
      <AppHeaderActions />
    </Flex>
  );
}

function Content({ children, ...props }: BoxProps) {
  return (
    <main>
      <Box {...props}>{children}</Box>
    </main>
  );
}

const breadcrumbData: Record<string, { label: string; enabled: boolean }> = {
  '/': { label: 'Dashboard', enabled: true },
  'create-strategy': { label: 'Create strategy', enabled: true },
  'dca-in': { label: 'DCA In', enabled: false },
  'dca-plus-in': { label: 'DCA+ In', enabled: false },
  'dca-plus-out': { label: 'DCA+ Out', enabled: false },
  'weighted-scale-in': { label: 'Weighted Scale In', enabled: false },
  'weighted-scale-out': { label: 'Weighted Scale Out', enabled: false },
  'dca-out': { label: 'DCA Out', enabled: false },
  strategies: { label: 'My strategies', enabled: true },
  'top-up': { label: 'Top up strategy', enabled: false },
  configure: { label: 'Configure strategy destination', enabled: false },
  customise: { label: 'Customise strategy', enabled: false },
};

function FlowBreadcrumbs() {
  const router = useRouter();
  const pathParts = router.asPath.split('/').filter((part) => part?.trim() !== '');

  return (
    <Breadcrumb separator=">">
      {pathParts.map((part, index) => {
        const previousParts = pathParts.slice(0, index);
        const href = previousParts?.length > 0 ? `/${previousParts?.join('/')}/${part}` : `/${part}`;
        return breadcrumbData[part] ? (
          <BreadcrumbItem key={`breadcrumb-item-${String(index)}`}>
            <LinkWithQuery href={breadcrumbData[part].enabled ? href : ''}>
              <BreadcrumbLink key={`breadcrumb-link-${String(index)}`}>{breadcrumbData[part].label}</BreadcrumbLink>
            </LinkWithQuery>
          </BreadcrumbItem>
        ) : null;
      })}
    </Breadcrumb>
  );
}

function FlowLayout({ children }: { children: ReactElement }) {
  const { address } = useWallet();
  const { chainId: chain } = useChainId();

  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      <AppHeader />
      <Content
        bgImage={
          OSMOSIS_CHAINS.includes(chain) ? '/images/backgrounds/osmoBackground.svg' : '/images/backgrounds/twist.svg'
        }
        backgroundPosition="bottom"
        backgroundSize={OSMOSIS_CHAINS.includes(chain) ? 'cover' : 'center'}
        backgroundRepeat="no-repeat"
        minH="100vh"
        backgroundAttachment="fixed"
      >
        <Box fontSize="sm" pl={8} pt={`calc(${HEADER_HEIGHT} + 24px)`} fontWeight="bold">
          <FlowBreadcrumbs />
        </Box>
        {isStepOne(pathname) ? (
          children
        ) : !address ? (
          <ModalWrapper stepsConfig={[]}>
            <AssetPageStrategyButtons />
            <ConnectWallet h={80} />
          </ModalWrapper>
        ) : (
          children
        )}
      </Content>
    </>
  );
}

export function getFlowLayout(page: ReactElement) {
  return <FlowLayout>{page}</FlowLayout>;
}

function SidebarLayout({ children, linkItems }: { children: ReactElement; linkItems: LinkItem[] }) {
  const { isPageLoading } = usePageLoad();
  const { isAdmin } = useAdmin();

  const AdminLinkItems: Array<LinkItem> = [
    ...linkItems,
    { name: 'Stats & totals', icon: Graph2Icon, href: Pages.StatsAndTotals },
    { name: 'All strategies', icon: ViewListIcon, href: Pages.AllStrategies },
  ];

  return (
    <Sidebar linkItems={isAdmin ? AdminLinkItems : linkItems}>
      <AppHeaderForSidebar />
      <Box position="relative" h="full" w="full">
        {isPageLoading && (
          <Flex
            zIndex={10}
            position="absolute"
            h={`calc(100vh - ${HEADER_HEIGHT})`}
            w="full"
            justifyContent="center"
            alignItems="center"
            backdropFilter="auto"
            backdropBlur="2px"
          >
            <Spinner />
          </Flex>
        )}
        <Content maxW="8xl" pl={6} pr={8} pt={4} pb={8}>
          {children}
        </Content>
      </Box>
    </Sidebar>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return <SidebarLayout linkItems={LinkItems}>{page}</SidebarLayout>;
}
