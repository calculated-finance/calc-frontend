import { ComponentWithAs, Icon as ChakraIcon, IconProps } from '@chakra-ui/react';
import { SVGProps } from 'react';

function Icon({
  as,
  ...props
}: IconProps & { as?: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | ComponentWithAs<'svg', IconProps> }) {
  return <ChakraIcon as={as} fontSize="xl" stroke="white" strokeWidth={4} {...props} />;
}
Icon.defaultProps = {
  as: undefined,
};

export default Icon;
