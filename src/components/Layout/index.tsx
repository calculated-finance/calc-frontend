import {
  Box,
  Flex,
  Spacer,
  Image,
  BoxProps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactElement, useEffect } from 'react';
import { useWallet } from '@hooks/useWallet';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import usePageLoad from '@hooks/usePageLoad';
import { useRouter } from 'next/router';
import { useCookieState } from 'ahooks';
import { Graph2Icon, ViewListIcon } from '@fusion-icons/react/interface';
import { useAdmin } from '@hooks/useAdmin';
import { useChainId } from '@hooks/useChainId';
import { ModalWrapper } from '@components/ModalWrapper';
import LinkWithQuery from '@components/LinkWithQuery';
import { AssetPageStrategyButtons } from '@components/AssetsPageAndForm/AssetPageStrategyButtons';
import { isStepOne } from '@helpers/isStepOne';
import Sidebar from './Sidebar';
import { TermsModal } from '../TermsModal';
import { SidebarControls } from './SidebarControls';
import { ControlDeskLinkItems, LinkItem, LinkItems } from './Sidebar/LinkItems';
import { Pages } from './Sidebar/Pages';

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
      <SidebarControls />
    </Flex>
  );
}

function AppHeader() {
  const { chainId: chain } = useChainId();
  return (
    <Flex position="absolute" h={HEADER_HEIGHT} w="full" p={8} alignItems="center">
      <LinkWithQuery href="/">
        {['osmosis-1', 'osmo-test-5'].includes(chain) ? (
          <Image cursor="pointer" src="/images/osmoLogo.svg" w={105} />
        ) : (
          <Image cursor="pointer" src="/images/logo.svg" w={105} />
        )}
      </LinkWithQuery>
      <Spacer />
      <SidebarControls />
    </Flex>
  );
}

function Content({ children, ...props }: BoxProps) {
  return (
    <>
      <main>
        <Box {...props}>{children}</Box>
      </main>
      {/* <Flex display={{ base: 'flex', sm: 'flex', md: 'none' }} p={8}>
        <Footer />
      </Flex> */}
    </>
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
          <BreadcrumbItem key={`breadcrum-item-${String(index)}`}>
            <LinkWithQuery href={breadcrumbData[part].enabled ? href : ''}>
              <BreadcrumbLink key={`breadcrum-link-${String(index)}`}>{breadcrumbData[part].label}</BreadcrumbLink>
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

  const isControlDesk = pathname.includes('control-desk');

  return (
    <>
      <AppHeader />
      <Content
        bgImage={
          ['osmosis-1', 'osmo-test-5'].includes(chain)
            ? '/images/backgrounds/osmoBackground.svg'
            : '/images/backgrounds/twist.svg'
        }
        backgroundPosition="bottom"
        backgroundSize={['osmosis-1', 'osmo-test-5'].includes(chain) ? 'cover' : 'center'}
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
            {!isControlDesk && <AssetPageStrategyButtons />}
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
  const { connected } = useWallet();

  //  create date one year from now
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const [acceptedAgreementState, setAcceptedAgreementState] = useCookieState('acceptedAgreement', {
    expires: oneYearFromNow,
  });

  const agreementPreviouslyAccepted = acceptedAgreementState === 'true';

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!agreementPreviouslyAccepted && connected) {
      onOpen();
    }
  }, [agreementPreviouslyAccepted, onOpen, connected]);

  const onSubmit = () => {
    setAcceptedAgreementState('true');
  };

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
      <TermsModal isOpen={isOpen} onClose={onClose} showCheckbox onSubmit={onSubmit} />
    </Sidebar>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return <SidebarLayout linkItems={LinkItems}>{page}</SidebarLayout>;
}
