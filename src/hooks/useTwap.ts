import getDenomInfo from '@utils/getDenomInfo';
import { findPair } from '@helpers/findPair';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { useConfig } from '@hooks/useConfig';
import usePairs from './usePairs';

export default function useTwap(
  initialDenom: DenomInfo | undefined,
  resultingDenom: DenomInfo | undefined,
  route?: string,
  enabled = true,
) {
  const config = useConfig();
  const { cosmWasmClient } = useCosmWasmClient();
  const { pairs } = usePairs();

  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data: twap, ...helpers } = useQuery<number>(
    ['twap', cosmWasmClient, initialDenom, resultingDenom, route],
    async () => {
      const twapToNow = await cosmWasmClient!.queryContractSmart(config!.exchange_contract_address, {
        get_twap_to_now: {
          swap_denom: initialDenom!.id,
          target_denom: resultingDenom!.id,
          period: config!.twap_period,
          route,
        },
      });

      const resultingInfo = getDenomInfo(resultingDenom!.id);
      const initialInfo = getDenomInfo(initialDenom!.id);

      return Number(twapToNow) * 10 ** (resultingInfo.significantFigures - initialInfo.significantFigures);
    },
    {
      enabled: !!cosmWasmClient && !!pair && !!config && enabled,
      cacheTime: 15000,
      retry: true,
      meta: {
        errorMessage: 'Error fetching twap',
      },
    },
  );

  return {
    twap,
    ...helpers,
  };
}
