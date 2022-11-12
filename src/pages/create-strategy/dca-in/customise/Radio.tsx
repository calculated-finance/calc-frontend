import { HStack, StackProps } from '@chakra-ui/react';
import { ChildrenProp } from "@components/ChildrenProp";

export default function Radio({ children, ...props }: ChildrenProp & StackProps) {
  return (
    <HStack bg="abyss.200" w="min-content" borderRadius="2xl" px={1} py={1} {...props}>
      {children}
    </HStack>
  );
}
