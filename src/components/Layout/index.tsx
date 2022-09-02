import { Box, Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { CosmosWallet } from '@components/CosmosWallet';
import Footer from '@components/Footer';
import Sidebar from '../Sidebar';

function AppHeader() {
  return (
    <Flex h={16} w="full" p={8} justifyContent="end" alignItems="center" display={{ base: 'none', md: 'flex' }}>
      <CosmosWallet />
    </Flex>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <AppHeader />
      <main>
        <Box maxW="8xl" px={6} py={4}>
          {children}
        </Box>
      </main>
      <Flex display={{ base: 'flex', md: 'flex', lg: 'none' }} p={8}>
        <Footer />
      </Flex>
    </Sidebar>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}
