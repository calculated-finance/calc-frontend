import { useQueryContract, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

export default function useStrategies() {
  const { address } = useWallet();

  const { data, ...result } = useQueryContract({
    address: CONTRACT_ADDRESS,
    msg: {
      get_all_active_vaults: {
        address,
      },
    },
  });

  // log address
  console.log(address);
  console.log('data', data && data.vaults.map((vault: any) => vault[1]));

  return {
    ...result,
    data: data && data.vaults.filter((vault: any) => vault[0][0] === address).map((vault: any) => vault[1]),
  };
}
