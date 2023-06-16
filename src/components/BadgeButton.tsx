import { Badge, BadgeProps, HStack } from '@chakra-ui/react';
import { routerPush } from '@helpers/routerPush';
import { useRouter } from 'next/router';

export default function BadgeButton({ url, children, ...props }: { url: string } & BadgeProps) {
  const router = useRouter();
  const handleClick = () => {
    routerPush(router, url);
  };
  return (
    <Badge
      display="inline-flex"
      lineHeight={1.5}
      flexDirection="row"
      borderRadius="2xl"
      as="button"
      onClick={handleClick}
      fontSize="sm"
      _hover={{ bg: 'blue.200', color: 'navy' }}
      size="large"
      bg="abyss.200"
      px={2}
      {...props}
    >
      <HStack spacing={1}>{children}</HStack>
    </Badge>
  );
}
