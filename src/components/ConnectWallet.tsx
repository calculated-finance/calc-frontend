import { Button, Flex, FlexProps, Heading, Link, Stack, Text, Image } from '@chakra-ui/react';
import { useWallet } from '@hooks/useWallet';
import { useAnalytics } from '@hooks/useAnalytics';
import { useWalletModal } from 'src/hooks/useWalletModal';
import Spinner from './Spinner';

function ConnectWallet(props: FlexProps) {
  const { isConnecting } = useWallet();
  const { setVisible } = useWalletModal();
  const { track } = useAnalytics();

  const handleConnect = () => {
    track('Connect Wallet Button Clicked');
    setVisible(true);
  };
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" w="full" h="sm" p={4} {...props}>
      <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" w="full" h="full">
        {isConnecting ? (
          <Spinner />
        ) : (
          <>
            <Stack spacing={8} align="center">
              <Image w={28} h={28} src="/images/notConnected.png" />
              <Heading size="sm" textAlign="center">
                You will need to connect to a wallet before continuing.
              </Heading>
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
