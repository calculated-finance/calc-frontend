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
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { isStepOne } from '@helpers/isStepOne';
import { ModalWrapper } from '@components/ModalWrapper';
import LinkWithQuery from '@components/LinkWithQuery';
import { featureFlags } from 'src/constants';
import Sidebar from './Sidebar';
import { TermsModal } from '../TermsModal';
import { SidebarControls } from './SidebarControls';

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
  const { chain } = useChain();
  return (
    <Flex position="absolute" h={HEADER_HEIGHT} w="full" p={8} alignItems="center">
      <LinkWithQuery href="/">
        {chain === Chains.Osmosis ? (
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
  const { chain } = useChain();

  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      <AppHeader />
      <Content
        bgImage={chain === Chains.Osmosis ? '/images/backgrounds/osmoBackground.svg' : '/images/backgrounds/twist.svg'}
        backgroundPosition="bottom"
        backgroundSize={chain === Chains.Osmosis ? 'cover' : 'center'}
        backgroundRepeat="no-repeat"
        minH="100vh"
        backgroundAttachment="fixed"
      >
        <Box fontSize="sm" pl={8} pt={`calc(${HEADER_HEIGHT} + 24px)`} fontWeight="bold">
          <FlowBreadcrumbs />
        </Box>
        {isStepOne(pathname) && featureFlags.unconnectedFirstStepEnabled ? (
          children
        ) : !address ? (
          <ModalWrapper stepsConfig={[]}>
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

function SidebarLayout({ children }: { children: ReactElement }) {
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

  return (
    <Sidebar>
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
  return <SidebarLayout>{page}</SidebarLayout>;
}
