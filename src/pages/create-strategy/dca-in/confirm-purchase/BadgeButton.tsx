import { Badge, BadgeProps, HStack } from '@chakra-ui/react';

export default function BadgeButton({ children, ...props }: BadgeProps) {
  return (
    <Badge
      display="inline-flex"
      lineHeight={1.5}
      flexDirection="row"
      borderRadius="2xl"
      as="button"
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
