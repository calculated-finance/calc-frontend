import { Coin } from '@cosmjs/proto-signing';
import { DenomInfo } from '@utils/DenomInfo';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChainId';
import { useChainClient } from './useChainClient';
import useDenoms from './useDenoms';

const useRoute = (swapAmount?: Coin, targetDenom?: DenomInfo) => {
  const { chainId } = useChainId();
  const chainClient = useChainClient(chainId);
  const { getDenomById } = useDenoms();

  const result = useQuery(
    ['prices', 'route', chainId, swapAmount?.denom, swapAmount?.amount, targetDenom?.id],
    () => chainClient?.fetchRoute(getDenomById(swapAmount!.denom)!, targetDenom!, Number(swapAmount!.amount)),
    {
      enabled: !!chainId && !!chainClient && !!swapAmount && !!getDenomById(swapAmount!.denom) && !!targetDenom,
      staleTime: 1000 * 60,
      meta: {
        errorMessage: 'Error fetching route',
      },
    },
  );

  return {
    route: result.data?.route,
    ...result,
  };
};

export default useRoute;
