import { Flex, Box, Text, Stack } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import DenomIcon from './DenomIcon';

export function PortfolioDiagram({ portfolio }: any) {
  return (
    <Flex gap={12} justifyContent="space-evenly">
      {portfolio.map(({ denom, percentage }: any) => (
        <Stack alignItems="center" key={denom}>
          <Text fontSize="xs">{getDenomInfo(denom).name}</Text>
          <DenomIcon size={8} denomName={denom} />
          <Text fontSize="sm">{percentage}%</Text>
        </Stack>
      ))}
    </Flex>
  );
}
