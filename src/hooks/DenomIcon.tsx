import { Image } from '@chakra-ui/react';
import { denoms } from './usePairs';

function DenomIcon({ denomName }: any) {
  return <Image display="inline" src={denoms[denomName].icon} width={4} height={4} />;
}

export default DenomIcon;
