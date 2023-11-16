import { useChainId } from '@hooks/useChain';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { LoadingState } from './LoadingState';

export function ChainWrapper({ children }: ChildrenProp) {
  const { chainId: chain, isLoading } = useChainId();

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
