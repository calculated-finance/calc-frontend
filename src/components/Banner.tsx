import { CloseButton, Stack, Button, Box, Text, useDisclosure, Flex, Spacer } from '@chakra-ui/react';
import { useSize } from 'ahooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { featureFlags, FEE_FREE_USK_PROMO_DESCRIPTION } from 'src/constants';
import { Pages } from './Sidebar/Pages';

export default function Banner() {
  const router = useRouter();
  const isHome = router.pathname === Pages.Home;
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: isHome });

  const endDate = new Date('January 19, 2023 00:00:00');
  const daysLeft = Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const ref = React.useRef(null);
  const { height } = useSize(ref) || {};

  return featureFlags.uskPromoEnabled ? (
    <Box h={`${height}px`}>
      <Box
        py={{ base: '4', md: '2.5' }}
        px={4}
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
                {FEE_FREE_USK_PROMO_DESCRIPTION} The promo lasts {daysLeft} more days!
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
