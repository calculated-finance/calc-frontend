import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { getMarsParamsAddress, getRedBankAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { ResultingDenomInfo } from '@utils/DenomInfo';
import { useChainId } from '@hooks/useChainId';

// from https://github.com/mars-protocol/interface/blob/main/src/types/interfaces/redbank.d.ts
interface InterestRateModel {
  optimal_utilization_rate: string;
  base: string;
  slope_1: string;
  slope_2: string;
}

interface Market {
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

export function useMarket(resultingDenom: ResultingDenomInfo | undefined) {
  const { chainId } = useChainId();
  const { cosmWasmClient } = useCosmWasmClient();

  return useQuery<Market>(
    ['mars-market', cosmWasmClient, resultingDenom?.id],
    async () => {
      if (!resultingDenom) {
        throw new Error('No resulting denom');
      }

      try {
        const [marketResult, paramsResult] = await Promise.all([
          cosmWasmClient!.queryContractSmart(getRedBankAddress(chainId), {
            market: { denom: resultingDenom.id },
          }),
          cosmWasmClient!.queryContractSmart(getMarsParamsAddress(chainId), {
            asset_params: { denom: resultingDenom.id },
          }),
        ]);

        return { ...marketResult, ...paramsResult.red_bank };
      } catch (error) {
        return {};
      }
    },
    {
      enabled: !!cosmWasmClient && !!resultingDenom,
      meta: {
        errorMessage: 'Error fetching Mars data',
      },
    },
  );
}
