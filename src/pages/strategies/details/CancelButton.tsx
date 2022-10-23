import { useDisclosure, Button } from '@chakra-ui/react';
import CancelStrategyModal from '@components/CancelStrategyModal';
import CalcIcon from '@components/Icon';
import { CloseBoxedIcon } from '@fusion-icons/react/interface';
import { Strategy } from '@hooks/useStrategies';
import { useRouter } from 'next/router';

export function CancelButton({ strategy }: { strategy: Strategy }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    router.push('/strategies');
  };

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        colorScheme="red"
        leftIcon={<CalcIcon as={CloseBoxedIcon} stroke="red.200" width={4} height={4} />}
        onClick={onOpen}
        data-testid="cancel-strategy-button"
      >
        Cancel
      </Button>
      <CancelStrategyModal isOpen={isOpen} onClose={handleClose} onCancel={handleCancel} strategy={strategy} />
    </>
  );
}
