import { Button, Center } from '@chakra-ui/react';

export function InvalidData({ onRestart }: { onRestart: () => void }) {
  return (
    <Center>
      Invalid Data, please&nbsp;
      <Button onClick={onRestart} variant="link">
        restart
      </Button>
    </Center>
  );
}
