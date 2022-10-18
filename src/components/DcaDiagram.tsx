import { Flex, HStack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import Lottie from 'lottie-react';
import arrow from '../pages/create-strategy/dca-in/confirm-purchase/arrow.json';

export default function DcaDiagram({ initialDenom, initialDeposit, resultingDenom }: any) {
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomName={initialDenom} />
        <Text>
          {initialDeposit}&nbsp;{initialDenomName}
        </Text>
      </HStack>
      <Lottie animationData={arrow} loop />
      <HStack>
        <DenomIcon denomName={resultingDenom} />
        <Text>{resultingDenomName}</Text>
      </HStack>
    </Flex>
  );
}
