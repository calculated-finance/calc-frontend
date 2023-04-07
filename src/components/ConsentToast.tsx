import React from 'react';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GDPRStoreState {
  version: number;
  accepted: boolean;
  rejected: boolean;
  setAccepted: (currentVersion: number) => void;
  setRejected: (currentVersion: number) => void;
}

const useGDPRStore = create<GDPRStoreState>(
  persist(
    (set) => ({
      version: 0,
      accepted: false,
      rejected: false,
      setAccepted: (currentVersion) => set({ accepted: true, rejected: false, version: currentVersion }),
      setRejected: (currentVersion) => set({ accepted: false, rejected: true, version: currentVersion }),
    }),
    {
      key: 'gdpr-acceptance',
      getStorage: () => localStorage,
    },
  ),
);

export function ConsentToast() {
  const toast = useToast();
  const currentVersion = 1; // Update this value whenever the privacy policy changes
  const storedVersion = useGDPRStore((state) => state.version);
  const accepted = useGDPRStore((state) => state.accepted);
  const rejected = useGDPRStore((state) => state.rejected);
  const setAccepted = useGDPRStore((state) => state.setAccepted);
  const setRejected = useGDPRStore((state) => state.setRejected);

  const handleAccept = () => {
    toast.closeAll();
    setAccepted(currentVersion);
  };

  const handleReject = () => {
    toast.closeAll();
    setRejected(currentVersion);
  };
  const showGDPRToast = () => {
    if (!accepted || storedVersion !== currentVersion) {
      toast({
        duration: null,
        isClosable: false,
        render: () => (
          <Box color="white" p={3} bg="abyss.200" borderRadius="md">
            <Flex justifyContent="space-between" alignItems="center">
              <Text>
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of
                cookies.{' '}
                <a href="/privacy-policy" style={{ color: 'white' }}>
                  Learn more
                </a>
              </Text>
              <Flex>
                <Button size="sm" mr={2} onClick={handleAccept}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={handleReject}>
                  Reject
                </Button>
              </Flex>
            </Flex>
          </Box>
        ),
      });
    }
  };

  React.useEffect(() => {
    showGDPRToast();
  }, []);

  return null;
}
