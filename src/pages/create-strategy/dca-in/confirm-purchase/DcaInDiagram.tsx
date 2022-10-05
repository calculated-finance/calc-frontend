import { Flex, HStack, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import Lottie from 'lottie-react';
import arrow from './arrow.json';

export default function DcaInDiagram({ quoteDenom, initialDeposit, baseDenom }: any) {
  const { name: quoteDenomName } = getDenomInfo(quoteDenom);
  const { name: baseDenomName } = getDenomInfo(baseDenom);
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomName={quoteDenom} />
        <Text>
          {initialDeposit} {quoteDenomName}
        </Text>
      </HStack>
      <Lottie animationData={arrow} loop />
      <HStack>
        <DenomIcon denomName={baseDenom} />
        <Text>{baseDenomName}</Text>
      </HStack>
    </Flex>
  );
}
