import { max } from 'lodash';
import { TransactionType } from '@components/TransactionType';
import getDenomInfo from '@utils/getDenomInfo';
import { findPair } from '@helpers/findPair';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { useConfig } from '@hooks/useConfig';
import usePairs from '../usePairs';
import { safeInvert } from './safeInvert';

export default function usePrice(
  resultingDenom: DenomInfo | undefined,
  initialDenom: DenomInfo | undefined,
  transactionType: TransactionType,
  enabled = true,
) {
  const config = useConfig();
  const client = useCosmWasmClient((state) => state.client);

  const { data: pairsData } = usePairs();
  const { pairs } = pairsData || {};
  const pair = pairs && resultingDenom && initialDenom ? findPair(pairs, resultingDenom, initialDenom) : null;

  const { data: price, ...helpers } = useQuery<number>(
    ['price', pair, client],
    async () => {
      const twapToNow = await client!.queryContractSmart(config!.exchange_contract_address, {
        get_twap_to_now: {
          swap_denom: initialDenom!.id,
          target_denom: resultingDenom!.id,
          period: config!.twap_period,
        },
      });

      const resultingInfo = getDenomInfo(resultingDenom!.id);
      const initialInfo = getDenomInfo(initialDenom!.id);

      const adjustedPrice =
        Number(twapToNow) * 10 ** (resultingInfo.significantFigures - initialInfo.significantFigures);

      return transactionType === TransactionType.Sell ? safeInvert(Number(adjustedPrice)) : adjustedPrice;
    },
    {
      enabled: !!client && !!pair && !!config && enabled,
      meta: {
        errorMessage: 'Error fetching price',
      },
    },
  );

  const pricePrecision = max([initialDenom?.pricePrecision || 0, resultingDenom?.pricePrecision || 0]);

  const formattedPrice = price
    ? price.toLocaleString('en-US', {
        maximumFractionDigits: pricePrecision || 3,
        minimumFractionDigits: 3,
      })
    : undefined;

  return {
    formattedPrice,
    price,
    ...helpers,
  };
}
