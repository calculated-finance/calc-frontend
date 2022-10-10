import { Image, Tooltip } from '@chakra-ui/react';
import { Denom } from '@hooks/usePairs';
import getDenomInfo from '@utils/getDenomInfo';

function DenomIcon({ denomName, showTooltip = false }: { denomName: Denom; showTooltip: boolean }) {
  const { name } = getDenomInfo(denomName);
  return (
    <Tooltip label={name} isDisabled={!showTooltip}>
      <Image
        data-testid={`denom-icon-${denomName}`}
        display="inline"
        src={getDenomInfo(denomName).icon}
        width={4}
        height={4}
      />
    </Tooltip>
  );
}

export default DenomIcon;
