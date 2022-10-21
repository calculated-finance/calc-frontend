import { Button, Center, Flex, FlexProps, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { useWallet } from '@wizard-ui/react';
import { useWalletModal } from 'src/hooks/useWalletModal';
import Spinner from './Spinner';

function ConnectWallet(props: FlexProps) {
  const { connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" w="full" h="sm" p={4} {...props}>
      <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" w="full" h="full">
        {connecting ? (
          <Spinner />
        ) : (
          <>
            <Stack spacing={1}>
              <Heading textAlign="center">No Wallet Connected</Heading>
              <Text color="grey.200" textAlign="center">
                Get started by connecting your wallet.
              </Text>
            </Stack>
            <Button onClick={handleConnect}>Connect to a wallet</Button>
            <Text color="grey.200" textAlign="center">
              Don&apos;t have a wallet?{' '}
              <Link href="https://www.keplr.app/" target="_blank" rel="noopener noreferrer">
                Create one here
              </Link>
            </Text>
          </>
        )}
      </Stack>
    </Flex>
  );
}

export default ConnectWallet;
