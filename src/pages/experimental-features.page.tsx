import { Box, Heading, Text } from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';

function Home() {
  return (
    <Box pb={8}>
      <Heading size="lg" mb={2}>
        Experimental features
      </Heading>
      <Text textStyle="body">This page contains experimental features that are not yet ready for production.</Text>
    </Box>
  );
}

Home.getLayout = getSidebarLayout;

export default Home;
