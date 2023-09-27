import { Flex, Heading, Spacer, Box } from '@chakra-ui/react';

export function SimpleDcaModalHeader() {
  return (
    <Flex
      bg="darkGrey"
      h={20}
      px={6}
      alignItems="center"
      borderRadius="2xl"
      mb={2}
      boxShadow="deepHorizon"
      data-testid="strategy-modal-header"
    >
      <Heading size="sm">Setup a simple dollar cost averaging (DCA) strategy</Heading>
      <Spacer />
    </Flex>
  );
}
