import { Heading, Stack, Text } from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';

function Settings() {
  return (
    <Stack spacing={6}>
      <Heading fontSize="3xl">Settings</Heading>
      <Text>No personal information is stored on-chain, it’s all hosted with our on/off ramp partner Kado Money.</Text>
      <Heading fontSize="xl">Title</Heading>
      <Text>CALC is a tool build for DeFi users, by DeFi users.</Text>
      <Heading fontSize="xl">Title</Heading>
      <Text>CALC is a tool build for DeFi users, by DeFi users.</Text>
    </Stack>
  );
}

Settings.getLayout = getSidebarLayout;

export default Settings;
