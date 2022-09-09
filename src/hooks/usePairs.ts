import { useQueryContract } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

export default function usePairs() {
  return useQueryContract({
    address: CONTRACT_ADDRESS,
    msg: {
      get_all_pairs: {},
    },
  });
}
