import { Flex, HStack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { DenomInfo } from '@utils/DenomInfo';
import Lottie from 'lottie-react';
import arrow from 'src/animations/arrow.json';

type OnceOffDiagramProps = {
  initialDenom: DenomInfo;
  targetAmount?: string | number;
  resultingDenom: DenomInfo;
};

export default function OnceOffDiagram({ initialDenom, targetAmount, resultingDenom }: OnceOffDiagramProps) {
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomInfo={initialDenom} />
        <Text>
          {initialDenom.name}
        </Text>
      </HStack>
      <Lottie animationData={arrow} loop />
      <HStack>
        <Text>
          {Boolean(targetAmount) && <>{targetAmount}&nbsp;</>}
        </Text>
        <DenomIcon denomInfo={resultingDenom} />
        <Text>{resultingDenom.name}</Text>
      </HStack>
    </Flex>
  );
}
