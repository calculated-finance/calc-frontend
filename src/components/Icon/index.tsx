import { Icon as ChakraIcon } from '@chakra-ui/react';

function Icon(props: any) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ChakraIcon fontSize="xl" stroke="white" strokeWidth={4} {...props} />;
}

export default Icon;
