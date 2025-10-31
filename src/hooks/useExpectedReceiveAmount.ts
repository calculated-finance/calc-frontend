import { Coin } from '@cosmjs/stargate';
import { useConfig } from '@hooks/useConfig';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { ResultingDenomInfo } from '@utils/DenomInfo';

export default function useExpectedReceiveAmount(
  swapAmount: Coin | undefined,
  targetDenom: ResultingDenomInfo | undefined,
  route?: string,
  enabled = true,
) {
  const config = useConfig();
  const { cosmWasmClient } = useCosmWasmClient();

  const { data: expectedReceiveAmount, ...helpers } = useQuery<Coin>(
    ['prices', 'expected-receive-amount', swapAmount?.denom, swapAmount?.amount, targetDenom?.id, route],
    async () => {
      try {
        const result = await cosmWasmClient!.queryContractSmart(config!.exchange_contract_address, {
          get_expected_receive_amount: {
            swap_amount: swapAmount,
            target_denom: targetDenom!.id,
            route,
          },
        });

        return result;
      } catch (error) {
        if (`${error}`.includes('amount of')) {
          throw new Error(`Invalid swap or receive amount`);
        }
        throw error;
      }
    },
    {
      enabled: !!cosmWasmClient && !!config && !!targetDenom?.id && !!swapAmount && enabled,
      cacheTime: 15000,
      retry: false,
      meta: {
        errorMessage: 'Error fetching expected receive amount',
      },
    },
  );

  return {
    expectedReceiveAmount,
    ...helpers,
  };
}
