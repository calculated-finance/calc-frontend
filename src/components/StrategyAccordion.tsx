import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Stack,
  Box,
  Accordion,
} from '@chakra-ui/react';
import { ChildrenProp } from '@helpers/ChildrenProp';

export function StrategiesAccordionButton({ children }: ChildrenProp) {
  return (
    <AccordionButton borderRadius="2xl" p={0} role="group" _hover={{ bg: 'none' }}>
      <Box as="span" flex="1" textAlign="left">
        {children}
      </Box>
      <Flex
        _groupHover={{ bg: 'blue.200' }}
        alignItems="center"
        justifyContent="center"
        p={1}
        borderRadius="full"
        mr={2}
      >
        <AccordionIcon _groupHover={{ color: 'abyss.200' }} />
      </Flex>
    </AccordionButton>
  );
}

export function StrategyAccordionPanel({ children }: ChildrenProp) {
  return (
    <AccordionPanel pb={0} px={0}>
      <Stack spacing={4}>{children}</Stack>
    </AccordionPanel>
  );
}

export function StrategyAccordionItem({ children }: ChildrenProp) {
  return <AccordionItem border="none">{children}</AccordionItem>;
}

export function StrategyAccordion({ children }: ChildrenProp) {
  return (
    <Accordion allowMultiple defaultIndex={[0]}>
      <Stack spacing={8}>{children}</Stack>
    </Accordion>
  );
}
