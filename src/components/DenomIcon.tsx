import { Box, Image, Tooltip } from '@chakra-ui/react';
import { Denom } from '@hooks/usePairs';
import getDenomInfo from '@utils/getDenomInfo';

function DenomIcon({
  denomName,
  size = 4,
  showTooltip = false,
}: {
  denomName: Denom;
  size?: number;
  showTooltip?: boolean;
}) {
  const { name, icon } = getDenomInfo(denomName);
  return (
    <Tooltip label={name} isDisabled={!showTooltip}>
      {icon ? (
        <Image data-testid={`denom-icon-${denomName}`} display="inline" src={icon} width={size} height={size} />
      ) : (
        <Box
          fontSize="xs"
          color="white"
          bg="orange.200"
          textTransform="capitalize"
          borderRadius="full"
          width={size}
          height={size}
          textAlign="center"
          lineHeight={size}
          cursor="default"
        >
          {name.charAt(0)}
        </Box>
      )}
    </Tooltip>
  );
}

export default DenomIcon;
