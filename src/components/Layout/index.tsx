import { Box, Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { CosmosWallet } from '@components/CosmosWallet';
import Sidebar from '../Sidebar';

function AppHeader() {
  return (
    <Flex p={3} w="full" justifyContent="end">
      <CosmosWallet />
    </Flex>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <AppHeader />
      <main>
        <Box maxW="8xl" p={4}>
          {children}
        </Box>
      </main>
    </Sidebar>
  );
}

export function getSidebarLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
}
