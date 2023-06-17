import { Button, Center } from '@chakra-ui/react';
import { routerPush } from '@helpers/routerPush';
import { useFormStore } from '@hooks/useFormStore';
import { useRouter } from 'next/router';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';

export function InvalidData() {
  const router = useRouter();
  const { formName } = useStrategyInfo();
  const { resetForm } = useFormStore();
  const handleRestart = () => {
    resetForm(formName)
    routerPush(router, '/create-strategy');
  };

  return (
    <Center>
      Invalid Data, please&nbsp;
      <Button onClick={handleRestart} variant="link">
        restart
      </Button>
    </Center>
  );
}
