import { Box, Flex, Spacer, Image } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import Footer from '@components/Footer';
import CosmosWallet from '@components/CosmosWallet';
import Link from 'next/link';
import Sidebar from '../Sidebar';

function AppHeaderForSidebar() {
  return (
    <Flex h={16} w="full" p={8} justifyContent="end" alignItems="center" display={{ base: 'none', md: 'flex' }}>
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

export function getFlowLayout(page: ReactElement) {
  return (
    <>
      <AppHeader />
      <Content>{page}</Content>
    </>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return (
    <Sidebar>
      <AppHeaderForSidebar />
      <Content>{page}</Content>
    </Sidebar>
  );
}
