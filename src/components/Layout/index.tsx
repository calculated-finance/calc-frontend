import { Box, Flex, Spacer, Image } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import Footer from '@components/Footer';
import CosmosWallet from '@components/CosmosWallet';
import Link from 'next/link';
import { useWallet } from '@wizard-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Spinner from '@components/Spinner';
import usePageLoad from '@hooks/usePageLoad';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
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
    <Flex h={16} w="full" p={8} alignItems="center">
      <Link href="/">
        <Image cursor="pointer" src="/images/logo.svg" />
      </Link>
      <Spacer />
      <CosmosWallet />
    </Flex>
  );
}

function Content({ children }: { children: ReactElement }) {
  return (
    <>
      <main>
        <Box maxW="8xl" px={6} py={4}>
          {children}
        </Box>
      </main>
      <Flex display={{ base: 'flex', sm: 'flex', md: 'none' }} p={8}>
        <Footer />
      </Flex>
    </>
  );
}

function FlowLayout({ children }: { children: ReactElement }) {
  const { address } = useWallet();

  return (
    <>
      <AppHeader />
      <Content>
        {address ? (
          children
        ) : (
          <NewStrategyModal>
            <NewStrategyModalHeader> Connect to a wallet </NewStrategyModalHeader>
            <NewStrategyModalBody>
              <ConnectWallet bg="transparent" h={56} />
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
        <Content>{children}</Content>
      </Box>
    </Sidebar>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
}
