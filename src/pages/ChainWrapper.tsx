import { Center, Text, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { ChainCards } from '@components/ChainSelection';
import { LoadingState } from './LoadingState';



export function ChainWrapper({ children }: ChildrenProp) {
  const { chain, isLoading } = useChain();

  if (isLoading) {
    return <LoadingState />;
  }
  // if (chain === Chains.None) {
  //   return (
  //     <Modal isOpen onClose={() => { }}>
  //       <ModalOverlay />
  //       <ModalContent>
  //         <ModalHeader>No chain selected</ModalHeader>
  //         <ModalBody>
  //           <Center justifyContent="center" flexDirection="column">
  //             <Text textStyle="body" size="md" mb={4}>
  //               Select a chain to continue
  //             </Text>
  //             <ChainCards onChainSelect={setChain} />
  //           </Center>

  //         </ModalBody>
  //       </ModalContent>
  //     </Modal>
  //   );
  // }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return chain ? <>{children}</> : <LoadingState />;
}
