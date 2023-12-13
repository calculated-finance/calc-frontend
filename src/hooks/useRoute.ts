import { Coin } from '@cosmjs/proto-signing';
import { getOsmosisRouterUrl } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import { useQuery } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';

const useRouteKujira = (_?: ChainId, __?: Coin, ___?: DenomInfo, _enabled = true) => ({ route: undefined });

const useRouteOsmosis = (chainId?: ChainId, swapAmount?: Coin, targetDenom?: DenomInfo, enabled = true) => {
  const { data: route, ...helpers } = useQuery(
    ['prices', 'route', chainId, swapAmount?.denom, swapAmount?.amount, targetDenom?.id],
    async () => {
      try {
        const response = await (
          await fetch(
            `${getOsmosisRouterUrl(chainId!)}/router/single-quote?${new URLSearchParams({
              tokenIn: `${swapAmount!.amount}${swapAmount!.denom}`,
              tokenOutDenom: targetDenom!.id,
            })}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        ).json();

        return Buffer.from(
          JSON.stringify(
            response.route.flatMap((r: any) =>
              r.pools.map((pool: any) => ({
                pool_id: `${pool.id}`,
                token_out_denom: pool.token_out_denom,
              })),
            ),
          ),
        ).toString('base64');
      } catch (error: any) {
        if (`${error}`.includes('amount of')) {
          const initialDenomInfo = getDenomInfo(swapAmount!.denom);
          throw new Error(
            `Swap amount of ${initialDenomInfo.fromAtomic(Number(swapAmount!.amount))} ${
              initialDenomInfo.name
            } too high to find dynamic osmosis route.`,
          );
        }

        throw error;
      }
    },
    {
      enabled: !!chainId && !!swapAmount && !!targetDenom && enabled,
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

const useRoute = (swapAmount?: Coin, targetDenom?: DenomInfo) => {
  const { chainId } = useChainId();

  const isEnabled = (currentChainId: ChainId) => !!swapAmount && !!targetDenom && chainId === currentChainId;

  const routes: Record<ChainId, any> = {
    'osmosis-1': useRouteOsmosis(chainId, swapAmount, targetDenom, isEnabled('osmosis-1')),
    'osmo-test-5': useRouteOsmosis(chainId, swapAmount, targetDenom, isEnabled('osmo-test-5')),
    'kaiyo-1': useRouteKujira(chainId, swapAmount, targetDenom, isEnabled('kaiyo-1')),
    'harpoon-4': useRouteKujira(chainId, swapAmount, targetDenom, isEnabled('harpoon-4')),
  };

  return routes[chainId] ?? { route: undefined };
};

export default useRoute;
