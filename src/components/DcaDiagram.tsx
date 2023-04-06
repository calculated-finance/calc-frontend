import { Flex, HStack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import Lottie from 'lottie-react';
import arrow from 'src/animations/arrow.json';

type DcaDiagramProps = {
  initialDenom: string;
  initialDeposit?: string | number;
  resultingDenom: string;
};

export default function DcaDiagram({ initialDenom, initialDeposit, resultingDenom }: DcaDiagramProps) {
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomName={initialDenom} />
        <Text>
          {Boolean(initialDeposit) && <>{initialDeposit}&nbsp;</>}
          {initialDenomName}
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
