import { Box, Collapse } from '@chakra-ui/react';
import { ChildrenProp } from '@helpers/ChildrenProp';

export function CollapseWithRender({ children, isOpen }: { isOpen: boolean | undefined } & ChildrenProp) {
  return (
    <Collapse in={Boolean(isOpen)} animateOpacity>
      {Boolean(isOpen) && <Box m="px">{children}</Box>}
    </Collapse>
  );
}
