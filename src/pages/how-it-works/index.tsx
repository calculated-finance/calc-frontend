import { Heading, Stack, Text, Image } from '@chakra-ui/react';
import { getSidebarLayout } from '../../components/Layout';
import { NextPageWithLayout } from '../_app';

// eslint-disable-next-line react/function-component-definition
const HowItWorks: NextPageWithLayout = () => (
  <Stack spacing={6}>
    <Heading fontSize="4xl">How CALC works, and why it exists</Heading>
    <Text>CALC is a tool build for DeFi users, by DeFi users.</Text>
    <Heading fontSize="xl">How CALC works</Heading>
    <Text>CALC is a tool build for DeFi users, by DeFi users.</Text>
    <Heading fontSize="xl">Why CALC was built</Heading>
    <Text>CALC is a tool build for DeFi users, by DeFi users.</Text>
    <Heading fontSize="xl">Dollar Cost averaging from your bank account with CALC</Heading>
    <Image src="/images/dca.svg" alt="Dollar Cost Averaging" />
    <Heading fontSize="xl">CALC&apos;s mission</Heading>
    <Text>CALC is a tool build for DeFi users, by DeFi users.</Text>
    <Heading as="i" fontSize="xl">
      CALC is all about saving you time and removing the emotion from the hardest part of Crypto, trading.
    </Heading>
  </Stack>
);

HowItWorks.getLayout = getSidebarLayout;

export default HowItWorks;
