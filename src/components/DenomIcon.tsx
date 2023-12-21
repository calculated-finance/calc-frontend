import { Box, Image, SkeletonCircle, Tooltip } from '@chakra-ui/react';
import { DenomInfo } from '@utils/DenomInfo';

function DenomIcon({
  denomInfo,
  size = 4,
  showTooltip = false,
}: {
  denomInfo: DenomInfo | undefined;
  size?: number;
  showTooltip?: boolean;
}) {
  if (!denomInfo) {
    return <SkeletonCircle width={size} height={size} />;
  }
  const { name, icon, id } = denomInfo;
  return (
    <Tooltip label={name} isDisabled={!showTooltip}>
      {icon ? (
        <Image data-testid={`denom-icon-${id}`} display="inline" src={icon} width={size} height={size} />
      ) : (
        <Box
          fontSize="xs"
          textTransform="capitalize"
          borderRadius="full"
          bg="black"
          width={size}
          height={size}
          textAlign="center"
          lineHeight={1.3}
          cursor="default"
        >
          {name?.charAt(0) || '?'}
        </Box>
      )}
    </Tooltip>
  );
}

export default DenomIcon;
