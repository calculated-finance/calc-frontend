import { Center } from '@chakra-ui/react';
import Spinner from '@components/Spinner';


export function LoadingState() {
  return (
    <Center h="100vh">
      <Spinner />
    </Center>
  );
}
