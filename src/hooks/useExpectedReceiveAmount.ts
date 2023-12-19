import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { useConfig } from '@hooks/useConfig';
import { Coin } from '@cosmjs/stargate';

export default function useExpectedReceiveAmount(
  swapAmount: Coin | undefined,
  targetDenom: DenomInfo | undefined,
  route?: string,
  enabled = true,
) {
  const config = useConfig();
  const { cosmWasmClient } = useCosmWasmClient();

  const { data: expectedReceiveAmount, ...helpers } = useQuery<Coin>(
    ['prices', 'expected-receive-amount', swapAmount?.denom, swapAmount?.amount, targetDenom?.id, route],
    async () => {
      try {
        return await cosmWasmClient!.queryContractSmart(config!.exchange_contract_address, {
          get_expected_receive_amount: {
            swap_amount: swapAmount,
            target_denom: targetDenom!.id,
            route,
          },
        });
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
