import { Box, Flex, Spacer, Image, BoxProps, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import CosmosWallet from '@components/CosmosWallet';
import Link from 'next/link';
import { useWallet } from '@wizard-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import usePageLoad from '@hooks/usePageLoad';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { useRouter } from 'next/router';
import Sidebar from '../Sidebar';

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
      <CosmosWallet />
    </Flex>
  );
}

function AppHeader() {
  return (
    <Flex position="absolute" h={HEADER_HEIGHT} w="full" p={8} alignItems="center">
      <Link href="/">
        <Image cursor="pointer" src="/images/logo.svg" />
      </Link>
      <Spacer />
      <CosmosWallet />
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
const breadcrumbData: Record<string, string> = {
  '/': 'Dashboard',
  'create-strategy': 'Create Strategy',
  'dca-in': 'DCA In',
  'dca-out': 'DCA Out',
  strategies: 'My strategies',
  'top-up': 'Top Up Strategy',
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
          <BreadcrumbItem>
            <Link href={href}>
              <BreadcrumbLink>{breadcrumbData[part]}</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
        ) : null;
      })}
    </Breadcrumb>
  );
}

function FlowLayout({ children }: { children: ReactElement }) {
  const { address } = useWallet();

  return (
    <>
      <AppHeader />
      <Content
        bgImage="/images/backgrounds/twist.svg"
        backgroundPosition="bottom"
        backgroundSize="center"
        backgroundRepeat="no-repeat"
        h="100vh"
      >
        <Box fontSize="sm" pl={8} pt={`calc(${HEADER_HEIGHT} + 24px)`} fontWeight="bold">
          <FlowBreadcrumbs />
        </Box>
        {address ? (
          children
        ) : (
          <NewStrategyModal>
            {/* TODO: we should do something around the way the stepper works here */}
            <NewStrategyModalHeader stepsConfig={[]}> Connect to a wallet </NewStrategyModalHeader>
            <NewStrategyModalBody stepsConfig={[]}>
              <ConnectWallet h={56} />
            </NewStrategyModalBody>
          </NewStrategyModal>
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
        <Content maxW="8xl" px={6} pt={4} pb={8}>
          {children}
        </Content>
      </Box>
    </Sidebar>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
}
