import { Image } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';

function DenomIcon({ denomName }: { denomName: string }) {
  return <Image display="inline" src={getDenomInfo(denomName).icon} width={4} height={4} />;
}

export default DenomIcon;
