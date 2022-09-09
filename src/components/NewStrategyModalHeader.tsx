import { Button, Flex, ModalHeader, Spacer, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { ArrowLeftIcon } from '@fusion-icons/react/interface';
import Link from 'next/link';
import { useRouter } from 'next/router';

function NewStrategyModalHeader({ backUrl, resetForm }: { backUrl: string; resetForm: () => void }) {
  // router
  const router = useRouter();

  const handleCancel = async () => {
    resetForm();
    router.push('/create-strategy');
  };
  return (
    <ModalHeader textAlign="center">
      <Flex>
        <Link passHref href={backUrl}>
          <Icon cursor="pointer" as={ArrowLeftIcon} />
        </Link>
        <Spacer />
        <Text>DCA in</Text>
        <Spacer />
        <Button onClick={handleCancel}>Cancel</Button>
      </Flex>
    </ModalHeader>
  );
}

export default NewStrategyModalHeader;
