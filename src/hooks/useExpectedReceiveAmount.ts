import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { useConfig } from '@hooks/useConfig';
import { Coin } from '@cosmjs/stargate';
import getDenomInfo from '@utils/getDenomInfo';

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
          const initialDenomInfo = getDenomInfo(swapAmount!.denom);
          throw new Error(
            `Insufficient liquidity to swap ${initialDenomInfo.fromAtomic(Number(swapAmount!.amount))} ${
              initialDenomInfo.name
            } for ${targetDenom!.name}`,
          );
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
