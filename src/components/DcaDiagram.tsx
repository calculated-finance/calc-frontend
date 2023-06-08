import { Flex, HStack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import { DenomInfo } from '@utils/DenomInfo';
import Lottie from 'lottie-react';
import arrow from 'src/animations/arrow.json';

type DcaDiagramProps = {
  initialDenom: DenomInfo;
  initialDeposit?: string | number;
  resultingDenom: DenomInfo;
};

export default function DcaDiagram({ initialDenom, initialDeposit, resultingDenom }: DcaDiagramProps) {
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomInfo={initialDenom} />
        <Text>
          {Boolean(initialDeposit) && <>{initialDeposit}&nbsp;</>}
          {initialDenom.name}
        </Text>
      </HStack>
      <Lottie animationData={arrow} loop />
      <HStack>
        <DenomIcon denomInfo={resultingDenom} />
        <Text>{resultingDenom.name}</Text>
      </HStack>
    </Flex>
  );
}
