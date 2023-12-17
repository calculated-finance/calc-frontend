import { Coin } from '@cosmjs/proto-signing';
import { DenomInfo } from '@utils/DenomInfo';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChainId';
import { useChainClient } from './useChainClient';

const useRoute = (swapAmount?: Coin, targetDenom?: DenomInfo) => {
  const { chainId } = useChainId();
  const chainClient = useChainClient(chainId);

  const { data: route, ...helpers } = useQuery(
    ['prices', 'route', chainId, swapAmount?.denom, swapAmount?.amount, targetDenom?.id],
    () => chainClient?.fetchRoute(swapAmount!, targetDenom!),
    {
      enabled: !!chainId && !!chainClient && !!swapAmount && !!targetDenom,
      staleTime: 1000 * 60,
      meta: {
        errorMessage: 'Error fetching route',
      },
    },
  );

  return {
    route,
    ...helpers,
  };
};

export default useRoute;
