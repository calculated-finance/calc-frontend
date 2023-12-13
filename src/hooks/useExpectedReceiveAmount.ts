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
    ['expected-receive-amount', swapAmount?.denom, swapAmount?.amount, targetDenom?.id, route],
    async () => {
      console.log('route 1', route);
      console.log(getDenomInfo('ibc/6329DD8CF31A334DD5BE3F68C846C9FE313281362B37686A62343BAC1EB1546D')?.name);

      let response;
      try {
        response = await cosmWasmClient!.queryContractSmart(config!.exchange_contract_address, {
          get_expected_receive_amount: {
            swap_amount: swapAmount,
            target_denom: targetDenom?.id,
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

      return response;
    },
    {
      enabled: !!cosmWasmClient && !!config && !!targetDenom && !!swapAmount && enabled,
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
