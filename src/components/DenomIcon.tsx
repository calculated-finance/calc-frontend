import { Box, Image, Tooltip, Text, Flex, Center } from '@chakra-ui/react';
import { Denom } from '@hooks/usePairs';
import getDenomInfo from '@utils/getDenomInfo';

function DenomIcon({ denomName, showTooltip = false }: { denomName: Denom; showTooltip?: boolean }) {
  const { name, icon } = getDenomInfo(denomName);
  return (
    <Tooltip label={name} isDisabled={!showTooltip}>
      {icon ? (
        <Image data-testid={`denom-icon-${denomName}`} display="inline" src={icon} width={4} height={4} />
      ) : (
        <Box
          fontSize="xs"
          color="white"
          bg="orange.200"
          textTransform="capitalize"
          borderRadius="full"
          width={4}
          height={4}
          textAlign="center"
          lineHeight={4}
          cursor="default"
        >
          {name.charAt(0)}
        </Box>
      )}
    </Tooltip>
  );
}

export default DenomIcon;
