import { useQueryContract, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

export default function useStrategies() {
  const { address } = useWallet();

  return useQueryContract({
    address: CONTRACT_ADDRESS,
    msg: {
      get_all_active_vaults_by_address: {
        address,
      },
    },
  });
}
