import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { getMarsAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';

// from https://github.com/mars-protocol/interface/blob/main/src/types/interfaces/redbank.d.ts
interface InterestRateModel {
  optimal_utilization_rate: string;
  base: string;
  slope_1: string;
  slope_2: string;
}
export interface Market {
  denom: string;
  max_loan_to_value: string;
  liquidation_threshold: string;
  liquidation_bonus: string;
  reserve_factor: string;
  interest_rate_model: InterestRateModel;
  borrow_index: string;
  liquidity_index: string;
  borrow_rate: string;
  liquidity_rate: string;
  indexes_last_updated: number;
  collateral_total_scaled: string;
  debt_total_scaled: string;
  deposit_enabled: boolean;
  borrow_enabled: boolean;
  deposit_cap: string;
}

export function useMarket(resultingDenom: DenomInfo | undefined) {
  const { getCosmWasmClient } = useCosmWasmClient();

  return useQuery<Market>(
    ['mars-market', getCosmWasmClient, resultingDenom?.id],
    async () => {
      const client = getCosmWasmClient && (await getCosmWasmClient());
      if (!client) {
        throw new Error('No client');
      }

      if (!resultingDenom) {
        throw new Error('No resulting denom');
      }

      try {
        const result = await client.queryContractSmart(getMarsAddress(), {
          market: { denom: resultingDenom.id },
        });

        return result;
      } catch (error) {
        return {};
      }
    },
    {
      enabled: !!getCosmWasmClient && !!resultingDenom,
      meta: {
        errorMessage: 'Error fetching Mars data',
      },
    },
  );
}
