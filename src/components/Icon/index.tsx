import { Icon as ChakraIcon, IconProps } from '@chakra-ui/react';

// Since 'as' is not on IconProps, we need to add it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Icon({ as, ...props }: IconProps & { as?: any }) {
  return <ChakraIcon as={as} fontSize="xl" stroke="white" strokeWidth={4} {...props} />;
}
Icon.defaultProps = {
  as: undefined,
};

export default Icon;
