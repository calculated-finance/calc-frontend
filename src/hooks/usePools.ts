import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { SUPPORTED_DENOMS, SUPPORTED_DENOMS_FOR_DCA_PLUS } from '@utils/SUPPORTED_DENOMS';
import { useWallet } from '@hooks/useWallet';
import { CONTRACT_ADDRESS } from 'src/constants';
//import { PairsResponse } from 'src/interfaces/generated/response/get_pairs';
import { PoolsResponse } from 'src/interfaces/generated/response/get_pools';
import { Denom } from '@models/Denom';
import { Pool } from '@models/Pool';
import useQueryWithNotification from './useQueryWithNotification';

const hiddenPairs = [] as string[];

function isSupportedDenom(denom: Denom) {
  return SUPPORTED_DENOMS.includes(denom);
}

export function isSupportedDenomForDcaPlus(denom: Denom) {
  return SUPPORTED_DENOMS_FOR_DCA_PLUS.includes(denom) && isDenomVolatile(denom);
}

function orderAlphabetically(denoms: Denom[]) {
  return denoms.sort((a, b) => {
    const { name: nameA } = getDenomInfo(a);
    const { name: nameB } = getDenomInfo(b);
    return nameA.localeCompare(nameB);
  });
}

export function uniqueQuoteDenoms(pools: Pool[] | undefined) {
  return orderAlphabetically(
    Array.from(new Set(pools?.map((pool) => pool.quote_denom))).filter((denom) => SUPPORTED_DENOMS.includes(denom)),
  );
}

export function uniqueBaseDenoms(pools: Pool[] | undefined) {
  return orderAlphabetically(Array.from(new Set(pools?.map((pair) => pair.base_denom))).filter(isSupportedDenom));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: Denom | undefined, pools: Pool[] | undefined) {
  return orderAlphabetically(
    Array.from(
      new Set(pools?.filter((pool) => pool.quote_denom === initialDenom).map((pool) => pool.base_denom)),
    ).filter(isSupportedDenom),
  );
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: Denom | undefined, pools: Pool[] | undefined) {
  return orderAlphabetically(
    Array.from(
      new Set(pools?.filter((pool) => pool.base_denom === resultingDenom).map((pool) => pool.quote_denom)),
    ).filter(isSupportedDenom),
  );
}

export default function usePools() {
  const { client } = useWallet();

  const queryResult = useQueryWithNotification<PoolsResponse>(
    ['pools', client],
    async () => {
      const result = await client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_pools: {},
      });
      return result;
    },
    {
      enabled: !!client,
    },
  );
  return {
    ...queryResult,
    data: {
      //pairs: queryResult.data?.pairs.filter((pair) => !hiddenPairs.includes(pair.address)),
      pools: queryResult.data?.pools
    },
  };
}
