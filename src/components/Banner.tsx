import { CloseButton, Stack, Button, Box, Text, useDisclosure, Flex } from '@chakra-ui/react';
import { useSize } from 'ahooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { featureFlags } from 'src/constants';
import { Pages } from './Sidebar/Pages';

export default function Banner() {
  const router = useRouter();
  const isHome = router.pathname === Pages.Home;
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: isHome });

  const ref = React.useRef(null);
  const { height } = useSize(ref) || {};

  return featureFlags.dcaPlusEnabled ? (
    <Box h={`${height}px`}>
      <Box
        py={{ base: '4', md: '2.5' }}
        px={8}
        position="fixed"
        zIndex={10}
        w="full"
        bg="blue.200"
        display={isOpen && isHome ? 'block' : 'none'}
        color="abyss.200"
        ref={ref}
      >
        <Box ref={ref}>
          <CloseButton display={{ md: 'none' }} position="absolute" right="2" top="2" onClick={onClose} />
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            spacing={{ base: '3', md: '2' }}
            alignItems={{ base: 'initial', md: 'center' }}
          >
            <Flex direction="row" align="center" w="full" pe={4}>
              <Text fontWeight="medium">
                DCA+ is now live! Same favorable risk profile as DCA, with a higher likelihood of better returns. Set up
                a strategy today and let the machine learning do the work for you.
              </Text>
            </Flex>
            <Link href={Pages.CreateStrategy}>
              <Button variant="outline" colorScheme="abyss" minW="max-content">
                Create a strategy
              </Button>
            </Link>
            <CloseButton onClick={onClose} display={{ base: 'none', md: 'inline-flex' }} />
          </Stack>
        </Box>
      </Box>
    </Box>
  ) : null;
}
