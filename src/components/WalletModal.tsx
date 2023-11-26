// import {
//   Button,
//   Link,
//   Stack,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalHeader,
//   ModalOverlay,
//   Image,
//   Text,
//   useToast,
//   useClipboard,
//   Flex,
//   SimpleGrid,
// } from '@chakra-ui/react';
// import { ChainWalletBase, WalletModalProps, WalletRepo, WalletStatus } from '@cosmos-kit/core';
// import { truncate } from '@helpers/truncate';
// import { useCallback } from 'react';
// import { MAINNET_CHAINS } from 'src/constants';

// export function WalletListItem({ wallet, onConnect }: { wallet: ChainWalletBase; onConnect: () => void }) {
//   const { walletInfo, connect } = wallet;

//   const handleClick = useCallback(async () => {
//     await connect(true);

//     if (wallet.isWalletConnected) {
//       setTimeout(() => {
//         onConnect();
//       }, 200);
//     }
//   }, []);

//   return (
//     <Stack
//       onClick={handleClick}
//       bg="deepHorizon"
//       p={6}
//       borderRadius="xl"
//       borderColor="slateGrey"
//       borderWidth={1}
//       cursor="pointer"
//       alignItems="center"
//       textAlign="center"
//       justifyContent="center"
//       spacing={3}
//       _hover={{
//         bg: 'abyss.200',
//         cursor: 'pointer',
//       }}
//     >
//       <Flex px={4}>
//         <Image
//           src={typeof walletInfo.logo === 'string' ? walletInfo?.logo : walletInfo?.logo?.minor}
//           alt={`${walletInfo.prettyName} icon`}
//         />
//       </Flex>
//       <Text fontSize="xs">{walletInfo.prettyName}</Text>
//     </Stack>
//   );
// }

// function Connected({ walletRepo, onCloseModal }: { walletRepo: WalletRepo | undefined; onCloseModal: () => void }) {
//   const address = walletRepo?.current?.address;
//   const { onCopy } = useClipboard(address || '');

//   const toast = useToast();

//   const handleCopy = () => {
//     onCopy();
//     toast({
//       title: 'Wallet address copied to clipboard',
//       position: 'top',
//       status: 'success',
//       duration: 9000,
//       isClosable: true,
//       variant: 'subtle',
//     });
//     onCloseModal();
//   };
//   return (
//     <ModalContent>
//       <ModalHeader>
//         <Text>Connected with {walletRepo?.current?.walletInfo.prettyName}</Text>
//         <Button size="xs" onClick={handleCopy} variant="ghost" colorScheme="white">
//           <Text textStyle="gradient">{truncate(walletRepo?.current?.address || '')}</Text>
//         </Button>
//       </ModalHeader>
//       <ModalBody>
//         <Stack spacing={6} align="center" textAlign="center" alignItems="center">
//           <Button size="sm" w="full" variant="outline" onClick={() => walletRepo?.disconnect()}>
//             Disconnect
//           </Button>
//         </Stack>
//       </ModalBody>
//     </ModalContent>
//   );
// }

// export function WalletModal({ isOpen, setOpen, walletRepo }: WalletModalProps) {
//   const onCloseModal = () => {
//     setOpen(false);
//   };

//   const { walletStatus } = walletRepo?.current || {};

//   if (walletStatus === WalletStatus.Connected) {
//     return (
//       <Modal isOpen={isOpen} onClose={onCloseModal} size="sm">
//         <ModalOverlay />
//         <Connected walletRepo={walletRepo} onCloseModal={onCloseModal} />
//       </Modal>
//     );
//   }

//   if (walletStatus === WalletStatus.Connecting) {
//     return (
//       <Modal isOpen={isOpen} onClose={onCloseModal} size="sm">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Connecting</ModalHeader>
//           <ModalBody>
//             <Button variant="outline" w="full" onClick={() => walletRepo?.disconnect()}>
//               Cancel
//             </Button>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     );
//   }

//   if (walletStatus === WalletStatus.Error) {
//     return (
//       <Modal isOpen={isOpen} onClose={onCloseModal}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Connection Error</ModalHeader>
//           <ModalBody>
//             <Button variant="outline" w="full" onClick={() => walletRepo?.disconnect()}>
//               Go back
//             </Button>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     );
//   }

//   if (walletStatus === WalletStatus.NotExist) {
//     return (
//       <Modal isOpen={isOpen} onClose={onCloseModal}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>{walletRepo?.current?.walletPrettyName} not installed</ModalHeader>
//           <ModalBody>
//             <Stack spacing={6}>
//               <Text textStyle="body-xs">
//                 If {walletRepo?.current?.walletPrettyName} is installed on your device, please refresh this page or
//                 follow the browser instruction.
//               </Text>
//               <Stack>
//                 <Link
//                   isExternal
//                   href={
//                     walletRepo?.current?.walletInfo.downloads?.find(
//                       (download) => download.device === walletRepo.env.device,
//                     )?.link
//                   }
//                 >
//                   <Button w="full">Install</Button>
//                 </Link>
//                 <Button variant="outline" w="full" onClick={() => walletRepo?.disconnect()}>
//                   Go back
//                 </Button>
//               </Stack>
//             </Stack>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     );
//   }

//   if (walletStatus === WalletStatus.Rejected) {
//     return (
//       <Modal isOpen={isOpen} onClose={onCloseModal}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Request Rejected</ModalHeader>

//           <ModalBody>
//             <Stack spacing="6">
//               <Text textAlign="center" textStyle="body-xs">
//                 Connection permission was denied.
//               </Text>
//               <Button w="full" variant="outline" onClick={() => walletRepo?.disconnect()}>
//                 Go back
//               </Button>
//             </Stack>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     );
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={onCloseModal} size="xs">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Choose Wallet</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <SimpleGrid columns={2} gap={4}>
//             {walletRepo?.wallets.map((wallet) => (
//               <WalletListItem key={wallet.walletName} wallet={wallet} onConnect={onCloseModal} />
//             ))}
//           </SimpleGrid>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// }

// // const wallets = useMemo(
// //   () =>
// //     walletRepo?.isMobile && !includeAllWalletsOnMobile
// //       ? walletRepo?.wallets.filter((w) =>
// //           typeof w.walletInfo.mobileDisabled === 'boolean'
// //             ? !w.walletInfo.mobileDisabled
// //             : !w.walletInfo.mobileDisabled()
// //         )
// //       : walletRepo?.wallets,
// //   [walletRepo, includeAllWalletsOnMobile]
// // );
